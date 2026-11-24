// 渲染锁：同一台机器上同一时间只跑一个重渲染（Motion Canvas 或 Manim）。放在 motion-canvas/scripts/render-lock.mjs，
// render.mjs 自动使用，不用手动调。Manim 和其他命令用 skill 的 scripts/render_lock.py run 包一层，两边是同一套协议：
//
//   锁 = 目录 LOCK_PATH（mkdir 是原子的，谁建成谁拿到），里面 owner.json：{owner, token, host, pids, started, cmd, cwd}
//   持锁的是真正在渲染的长驻进程（render.mjs 自己，或 render_lock.py run 的包装进程及其子进程），所以 pid 能用来判活
//   死锁 = 同一台机器上 pids 全都不在了 → 下一个等锁的进程自动清掉；目录在但 owner.json 还没写好、不到 60s → 当作正在创建
//   子进程从环境变量 RENDER_LOCK_TOKEN 认出“锁是上层进程替我拿的”，直接渲染（否则会自己等自己）
//
// 锁位置：环境变量 RENDER_LOCK_PATH，默认 /tmp/textbook-to-animation.render-lock（Windows 为系统临时目录下同名目录）。
// 整台机器一把，和章节、书无关：要防的是几个代理同时渲染抢内存、抢 Chrome。
import {randomBytes} from 'node:crypto';
import {mkdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync} from 'node:fs';
import {hostname, tmpdir} from 'node:os';
import {join} from 'node:path';

export const LOCK_PATH =
  process.env.RENDER_LOCK_PATH ||
  (process.platform === 'win32' ? join(tmpdir(), 'textbook-to-animation.render-lock') : '/tmp/textbook-to-animation.render-lock');
const OWNER = 'owner.json';
const CREATING_GRACE_MS = 60_000;
const sleep = ms => new Promise(r => setTimeout(r, ms));

export function readOwner(dir = LOCK_PATH) {
  try {
    return JSON.parse(readFileSync(join(dir, OWNER), 'utf8'));
  } catch {
    return null;
  }
}

function alive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return e.code === 'EPERM'; // 进程在，只是不属于当前用户
  }
}

export function describe(owner) {
  if (!owner) return '持锁信息还没写好';
  const age = Math.max(0, Math.round(Date.now() / 1000 - (owner.started || 0)));
  return `${owner.owner}（pid ${(owner.pids || []).join(',')}，${owner.host}，已持锁 ${Math.floor(age / 60)} 分 ${age % 60} 秒）`;
}

// {state: 'free' | 'held' | 'stale' | 'creating', owner}
export function inspect() {
  let st;
  try {
    st = statSync(LOCK_PATH);
  } catch {
    return {state: 'free', owner: null};
  }
  const owner = readOwner();
  if (!owner) return {state: Date.now() - st.mtimeMs < CREATING_GRACE_MS ? 'creating' : 'stale', owner: null};
  if (owner.host !== hostname()) return {state: 'held', owner}; // 别的机器（共享盘）：判不了活，当作还在用
  return {state: (owner.pids || []).some(alive) ? 'held' : 'stale', owner};
}

// 先把死锁挪到旁边，确认挪走的就是刚才判死的那把再删；挪走的若是别人刚拿的新锁，挪回去
function breakStale(seenToken) {
  const aside = `${LOCK_PATH}.stale-${process.pid}-${randomBytes(4).toString('hex')}`;
  try {
    renameSync(LOCK_PATH, aside);
  } catch {
    return; // 别人先清了
  }
  if ((readOwner(aside)?.token ?? null) === seenToken) {
    rmSync(aside, {recursive: true, force: true});
    return;
  }
  try {
    renameSync(aside, LOCK_PATH);
  } catch {
    console.error(`[lock] 挪走了一把刚建的新锁且没能挪回：${aside}`);
  }
}

function writeOwner(info) {
  const tmp = join(LOCK_PATH, `${OWNER}.${process.pid}.tmp`);
  writeFileSync(tmp, JSON.stringify(info, null, 1));
  renameSync(tmp, join(LOCK_PATH, OWNER));
}

// 拿到锁返回 {token, release()}；timeoutMin 分钟内拿不到返回 null（调用方必须不渲染、退出）
export async function acquire(owner, {timeoutMin = 90, cmd = '', log = s => console.log(s)} = {}) {
  const inherited = process.env.RENDER_LOCK_TOKEN;
  if (inherited && readOwner()?.token === inherited) {
    log(`[lock] 渲染锁由上层进程持有（${readOwner().owner}），直接渲染`);
    return {token: inherited, release() {}};
  }
  const token = randomBytes(8).toString('hex');
  const deadline = Date.now() + timeoutMin * 60_000;
  let said = 0;
  for (;;) {
    try {
      mkdirSync(LOCK_PATH); // 已存在就抛 EEXIST
      writeOwner({owner, token, host: hostname(), pids: [process.pid], started: Date.now() / 1000, cmd, cwd: process.cwd()});
      log(`[lock] 拿到渲染锁 ${LOCK_PATH}`);
      let released = false;
      return {
        token,
        release() {
          if (released) return;
          released = true;
          if (readOwner()?.token === token) rmSync(LOCK_PATH, {recursive: true, force: true});
          else console.error('[lock] 锁已经不是这个进程的了，不动它');
        },
      };
    } catch (e) {
      if (e.code !== 'EEXIST') throw e;
    }
    const s = inspect();
    if (s.state === 'stale') {
      log(`[lock] 清理死锁：${describe(s.owner)}，持锁进程已不在`);
      breakStale(s.owner?.token ?? null);
      continue;
    }
    if (s.state === 'free') continue;
    if (Date.now() >= deadline) {
      log(`[lock] 等锁超时（${timeoutMin} 分钟）：${describe(s.owner)} 还在渲染`);
      return null;
    }
    if (Date.now() - said >= 60_000) {
      log(`[lock] 排队等渲染锁：${describe(s.owner)}`);
      said = Date.now();
    }
    await sleep(2000);
  }
}
