// Headless render driver for Motion Canvas 3.17.2.
// 1. Starts the Vite dev server (the @motion-canvas/ffmpeg exporter talks to
//    the browser over the Vite HMR websocket, so a dev server is required).
// 2. Opens public/headless.html in headless Chromium via Puppeteer.
// 3. Waits until window.__renderResult is set, then exits.
// Output: ./output/replication-lag.mp4 (vite-plugin default output dir).
import {spawn} from 'node:child_process';
import puppeteer from 'puppeteer';

// Usage: node scripts/render.mjs [scene-name]
// With a scene name, only that scene renders, to ./output/<scene-name>.mp4.
// Without one, the whole project renders concatenated into replication-lag.mp4.
const SCENE = process.argv[2] ?? '';
const PORT = 9000;
const PAGE_URL = `http://127.0.0.1:${PORT}/headless.html${SCENE ? `?scene=${encodeURIComponent(SCENE)}` : ''}`;
const TIMEOUT_MS = 10 * 60 * 1000;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function waitForServer() {
  const start = Date.now();
  while (Date.now() - start < 120_000) {
    try {
      const res = await fetch(PAGE_URL);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await sleep(1000);
  }
  throw new Error('Vite dev server did not come up in 120s');
}

// NOTE (2026-11-20 review): npx failed intermittently with npm EPERM on
// its log file after ~14 successful renders, so vite is now launched
// directly from the local install instead of through npx.
// Same vite, same flags.
const vite = spawn(
  process.execPath,
  [
    new URL('../node_modules/vite/bin/vite.js', import.meta.url).pathname,
    '--port', String(PORT), '--strictPort', '--host', '127.0.0.1',
  ],
  {
    cwd: new URL('..', import.meta.url).pathname,
    stdio: 'inherit',
    detached: true, // own process group so we can kill the whole tree
  },
);

let browser;
try {
  await waitForServer();
  console.log('[render] vite is up, launching headless chromium...');
  browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1280,720',
      '--force-device-scale-factor=1',
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({width: 1280, height: 720});
  let pageFailed = null;
  page.on('console', msg => console.log('[page console]', msg.type(), msg.text()));
  page.on('pageerror', err => {
    console.log('[page error]', String(err));
    if (!pageFailed) pageFailed = String(err);
  });
  page.on('requestfailed', req => console.log('[request failed]', req.url(), req.failure()?.errorText));

  const t0 = Date.now();
  await page.goto(PAGE_URL, {waitUntil: 'domcontentloaded', timeout: 120_000});
  console.log('[render] page loaded, waiting for render to finish...');

  let lastFrame = -1;
  while (Date.now() - t0 < TIMEOUT_MS) {
    if (pageFailed) {
      console.error('[render] failing fast on page error:', pageFailed);
      process.exitCode = 1;
      break;
    }
    let state;
    try {
      state = await Promise.race([
        page.evaluate(() => ({
          status: window.__renderStatus,
          result: window.__renderResult,
          frame: window.__renderFrame,
          error: window.__renderError,
          settings: window.__renderSettings,
        })),
        sleep(15000).then(() => {
          throw new Error('evaluate timeout');
        }),
      ]);
    } catch (e) {
      console.log('[render] evaluate timed out, retrying...', String(e).slice(0, 120));
      await sleep(2000);
      continue;
    }
    if (state.frame !== undefined && state.frame !== lastFrame) {
      lastFrame = state.frame;
      console.log(`[render] frame ${state.frame} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    }
    if (state.error) {
      console.error('[render] page error:', state.error);
      process.exitCode = 1;
      break;
    }
    if (state.result !== undefined) {
      console.log(`[render] finished with result ${state.result} (0=Success) in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
      process.exitCode = state.result === 0 ? 0 : 1;
      break;
    }
    await sleep(2000);
  }
  if (process.exitCode === undefined) {
    console.error('[render] TIMEOUT after 10 minutes');
    process.exitCode = 1;
  }
} finally {
  if (browser) await browser.close().catch(() => {});
  try {
    process.kill(-vite.pid, 'SIGTERM'); // kill the whole vite process group
  } catch {
    vite.kill('SIGTERM');
  }
}
