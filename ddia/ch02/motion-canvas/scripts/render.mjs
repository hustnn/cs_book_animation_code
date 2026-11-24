// 无头渲染驱动：放在 motion-canvas/scripts/render.mjs（旁边放 render-lock.mjs）。
//   0. 拿渲染锁：整台机器同一时间只跑一个渲染，别的渲染在跑就排队（见 render-lock.mjs）
//   1. 启动 Vite dev server（ffmpeg 导出器通过 Vite HMR WebSocket 和浏览器通信，所以必须是 dev server）
//   2. Puppeteer 打开 public/headless.html（逻辑在 src/headless.ts）
//   3. 轮询 window.__renderResult，结束后退出、放锁
//
// 用法（在 motion-canvas/ 目录下）：
//   node scripts/render.mjs <场景名> [--qa [--strict]] [--port 9000] [--timeout 600] [--lock-timeout 90] [--w 1280 --h 720 --fps 30]
//   node scripts/render.mjs --help
// 产物：output/<场景名>.mp4（不给场景名时整个 project 拼成 output/project.mp4）
// --qa：QA 模式（画面与时长不变），逐拍检查文字重叠/出画/动画超时，报告写到 output/<场景名>.qa.json；
//       --strict 时有 error 级问题退出码为 2。
// --lock-timeout：等渲染锁最多多少分钟（默认 90）；等不到退出码 3，不渲染。
// 不认识的参数直接报错退出（退出码 64），不会当成场景名或被忽略。
// 依赖：devDependencies 里的 vite、puppeteer；@motion-canvas/vite-plugin 和 @motion-canvas/ffmpeg 已在 vite.config.ts 启用。

import {spawn} from 'node:child_process';
import {existsSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {acquire} from './render-lock.mjs';

const USAGE = `用法：node scripts/render.mjs <场景名> [--qa [--strict]] [--port 9000] [--timeout 600] [--lock-timeout 90] [--w 1280 --h 720 --fps 30]
  不给场景名：整个 project 渲染成 output/project.mp4
  --qa            逐拍 QA，报告写到 output/<场景名>.qa.json（整章用 skill 的 scripts/qa_chapter.py）
  --strict        与 --qa 同用：有 error 时退出码 2
  --port          Vite dev server 端口（默认 9000）
  --timeout       渲染超时秒数（默认 600）
  --lock-timeout  等渲染锁最多多少分钟（默认 90）；等不到退出码 3，不渲染
  --w --h --fps   分辨率与帧率（默认 1280 720 30）`;
const argv = process.argv.slice(2);
const VALUE_FLAGS = new Set(['--port', '--timeout', '--lock-timeout', '--w', '--h', '--fps']);
const BOOL_FLAGS = new Set(['--qa', '--strict']);
const opts = {};
const positional = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--help' || a === '-h') {
    console.log(USAGE);
    process.exit(0);
  } else if (VALUE_FLAGS.has(a)) {
    const v = argv[++i];
    if (v === undefined || !Number.isFinite(Number(v))) {
      console.error(`${a} 需要一个数字\n${USAGE}`);
      process.exit(64);
    }
    opts[a.slice(2)] = v;
  } else if (BOOL_FLAGS.has(a)) {
    opts[a.slice(2)] = true;
  } else if (a.startsWith('-')) {
    console.error(`不认识的参数 ${a}\n${USAGE}`);
    process.exit(64);
  } else {
    positional.push(a);
  }
}
if (positional.length > 1) {
  console.error(`一次只渲染一个场景，收到 ${positional.join(' ')}\n${USAGE}`);
  process.exit(64);
}
const opt = (name, def) => opts[name] ?? def;
const SCENE = positional[0] ?? '';
const QA = Boolean(opts.qa);
const STRICT = Boolean(opts.strict);
const PORT = Number(opt('port', 9000));
const TIMEOUT_MS = Number(opt('timeout', 600)) * 1000;
const LOCK_TIMEOUT_MIN = Number(opt('lock-timeout', 90));
const query = new URLSearchParams({w: opt('w', '1280'), h: opt('h', '720'), fps: opt('fps', '30')});
if (SCENE) query.set('scene', SCENE);
if (QA) query.set('qa', '1');
const PAGE_URL = `http://127.0.0.1:${PORT}/headless.html?${query}`;

// 用 fileURLToPath 而不是 URL#pathname：路径里有空格时 pathname 会变成 %20
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const VITE_BIN = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));

const sleep = ms => new Promise(r => setTimeout(r, ms));

function writeQaReport(findings) {
  const outDir = `${ROOT}output`;
  mkdirSync(outDir, {recursive: true});
  const file = `${outDir}/${SCENE || 'project'}.qa.json`;
  writeFileSync(file, JSON.stringify(findings, null, 2));
  const errors = findings.filter(f => f.severity === 'error');
  const warns = findings.filter(f => f.severity === 'warn');
  const byKind = {};
  for (const f of findings) byKind[`${f.severity}:${f.kind}`] = (byKind[`${f.severity}:${f.kind}`] ?? 0) + 1;
  console.log(`[qa] ${errors.length} error / ${warns.length} warn  ${JSON.stringify(byKind)}  → ${file}`);
  for (const f of [...errors, ...warns].slice(0, 40)) {
    const at = f.times.map(t => t.toFixed(2)).join(', ');
    const other = f.other ? `  ↔ ${f.other}` : '';
    const ratio = f.ratio !== undefined ? ` (${Math.round(f.ratio * 100)}%)` : '';
    console.log(`[qa] ${f.severity.padEnd(5)} ${f.beat.padEnd(6)} ${f.kind.padEnd(12)} t=${at}  “${f.text}”${other}${ratio}`);
  }
  return errors.length;
}

async function waitForServer() {
  const start = Date.now();
  while (Date.now() - start < 120_000) {
    try {
      if ((await fetch(PAGE_URL)).ok) return;
    } catch {
      // 还没起来
    }
    await sleep(1000);
  }
  throw new Error('Vite dev server 120 秒内没有启动');
}

const lock = await acquire(`render.mjs ${SCENE || '(整个工程)'}`, {timeoutMin: LOCK_TIMEOUT_MIN, cmd: argv.join(' ')});
if (!lock) {
  console.error('[render] 没拿到渲染锁，没有渲染（退出码 3）。不要绕过锁：等它渲完再跑，或用 render_lock.py status 看是谁');
  process.exit(3);
}
let vite;
const stopVite = () => {
  if (!vite) return;
  try {
    process.kill(-vite.pid, 'SIGTERM'); // 结束整个 vite 进程组
  } catch {
    vite.kill('SIGTERM');
  }
};
// 被 Ctrl+C / kill 时也要放锁、停掉 vite；被 kill -9 时放不了锁，持锁 pid 不在了，下一个等锁的会自动清
for (const [sig, code] of [['SIGINT', 130], ['SIGTERM', 143], ['SIGHUP', 129]]) {
  process.on(sig, () => {
    stopVite();
    lock.release();
    process.exit(code);
  });
}

let browser;
try {
  // 直接跑本地 vite（npx 偶发 EPERM 写日志失败）；没有本地安装时退回 npx
  const viteArgs = ['--port', String(PORT), '--strictPort', '--host', '127.0.0.1'];
  vite = existsSync(VITE_BIN)
    ? spawn(process.execPath, [VITE_BIN, ...viteArgs], {cwd: ROOT, stdio: 'inherit', detached: true})
    : spawn('npx', ['vite', ...viteArgs], {cwd: ROOT, stdio: 'inherit', detached: true});
  await waitForServer();
  console.log(`[render] vite ready, rendering ${SCENE || '(whole project)'} ...`);
  const {default: puppeteer} = await import('puppeteer'); // 动态 import：--help 和参数检查不需要装依赖
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });
  const page = await browser.newPage();
  let pageFailed = null;
  page.on('console', msg => console.log('[page]', msg.type(), msg.text()));
  page.on('pageerror', err => {
    console.log('[page error]', String(err));
    pageFailed ??= String(err);
  });

  const t0 = Date.now();
  await page.goto(PAGE_URL, {waitUntil: 'domcontentloaded', timeout: 120_000});
  let lastFrame = -1;
  while (Date.now() - t0 < TIMEOUT_MS) {
    if (pageFailed) {
      // 常见原因：某个场景有语法错误，整个 project 加载失败——先跑 npx tsc --noEmit
      console.error('[render] page error:', pageFailed);
      process.exitCode = 1;
      break;
    }
    let state;
    try {
      state = await Promise.race([
        page.evaluate(() => ({
          result: window.__renderResult,
          frame: window.__renderFrame,
          error: window.__renderError,
        })),
        sleep(15_000).then(() => {
          throw new Error('evaluate timeout');
        }),
      ]);
    } catch {
      await sleep(2000);
      continue;
    }
    if (state.frame !== undefined && state.frame !== lastFrame) {
      lastFrame = state.frame;
      if (lastFrame % 150 === 0) console.log(`[render] frame ${lastFrame}`);
    }
    if (state.error) {
      console.error('[render] error:', state.error);
      process.exitCode = 1;
      break;
    }
    if (state.result !== undefined) {
      const secs = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(`[render] finished: ${state.result} (0 = Success) in ${secs}s`);
      process.exitCode = state.result === 0 ? 0 : 1;
      if (QA && state.result !== 0) {
        // 渲染失败（场景抛错等）时探针没跑完，报告是空的或不全：不写，免得被当成“0 error”
        rmSync(`${ROOT}output/${SCENE || 'project'}.qa.json`, {force: true});
        console.error('[qa] 渲染失败，不写 QA 报告');
      } else if (QA) {
        // __qaFinalize：把只在一个采样点出现的重叠降为 warn（瞬时），见 lib/qa.ts
        const findings = await page.evaluate(() => (window.__qaFinalize ? window.__qaFinalize() : window.__qaReport) ?? []);
        const errors = writeQaReport(findings);
        if (STRICT && errors > 0 && process.exitCode === 0) process.exitCode = 2;
      }
      break;
    }
    await sleep(2000);
  }
  if (process.exitCode === undefined) {
    console.error(`[render] timeout after ${TIMEOUT_MS / 1000}s`);
    process.exitCode = 1;
  }
} finally {
  if (browser) await browser.close().catch(() => {});
  stopVite();
  lock.release();
}
