// 无头渲染驱动：放在 motion-canvas/scripts/render.mjs。
//   1. 启动 Vite dev server（ffmpeg 导出器通过 Vite HMR WebSocket 和浏览器通信，所以必须是 dev server）
//   2. Puppeteer 打开 public/headless.html（逻辑在 src/headless.ts）
//   3. 轮询 window.__renderResult，结束后退出
//
// 用法（在 motion-canvas/ 目录下）：node scripts/render.mjs <场景名> [--qa [--strict]] [--port 9000] [--timeout 600] [--w 1280 --h 720 --fps 30]
// 产物：output/<场景名>.mp4（不给场景名时整个 project 拼成 output/project.mp4）
// --qa：QA 模式（画面与时长不变），逐拍检查文字重叠/出画/动画超时，报告写到 output/<场景名>.qa.json；
//       --strict 时有 error 级问题退出码为 2。
// 依赖：devDependencies 里的 vite、puppeteer；@motion-canvas/vite-plugin 和 @motion-canvas/ffmpeg 已在 vite.config.ts 启用。

import {spawn} from 'node:child_process';
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import puppeteer from 'puppeteer';

const argv = process.argv.slice(2);
const opt = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : def;
};
const valueFlags = new Set(['--port', '--timeout', '--w', '--h', '--fps']);
const SCENE = argv.find((a, i) => !a.startsWith('--') && !valueFlags.has(argv[i - 1])) ?? '';
const QA = argv.includes('--qa');
const STRICT = argv.includes('--strict');
const PORT = Number(opt('port', 9000));
const TIMEOUT_MS = Number(opt('timeout', 600)) * 1000;
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

// 直接跑本地 vite（npx 偶发 EPERM 写日志失败）；没有本地安装时退回 npx
const viteArgs = ['--port', String(PORT), '--strictPort', '--host', '127.0.0.1'];
const vite = existsSync(VITE_BIN)
  ? spawn(process.execPath, [VITE_BIN, ...viteArgs], {cwd: ROOT, stdio: 'inherit', detached: true})
  : spawn('npx', ['vite', ...viteArgs], {cwd: ROOT, stdio: 'inherit', detached: true});

let browser;
try {
  await waitForServer();
  console.log(`[render] vite ready, rendering ${SCENE || '(whole project)'} ...`);
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
      if (QA) {
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
  try {
    process.kill(-vite.pid, 'SIGTERM'); // 结束整个 vite 进程组
  } catch {
    vite.kill('SIGTERM');
  }
}
