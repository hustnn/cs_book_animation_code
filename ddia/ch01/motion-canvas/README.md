# DDIA Motion Canvas 版 — 第 5 章 主从复制延迟

真实渲染出的 MP4：`../../videos/motion-canvas-replication-lag.mp4`
（44.0 秒，1280×720，30 fps，H.264，616 KB，无音频，中文旁白文字打在画面上）

## 版本（已锁定）

- Motion Canvas `3.17.2`（core / 2d / ui / vite-plugin 均为精确版本）
- `@motion-canvas/ffmpeg` `1.1.1`（导出 MP4 用）
- Vite `4.5.14`、Puppeteer `25.18.1`（自带 Chrome 157，仅作无头渲染驱动）

## 结构

- `src/project.ts` — 项目入口，只含 `replication-lag` 一个场景
- `src/scenes/replication-lag.tsx` — 场景：`makeScene2D` + 生成器时间轴，5 个步骤 + 小结卡片
- `src/components/ServerNode.tsx` — 可复用组件：圆角矩形 + 标题 + 数据值（信号驱动）+ 状态灯/状态文字；`setValue` / `setStatus` / `flash` 三个生成器方法
- `src/headless.ts` + `public/headless.html` — 无头渲染入口（见下）
- `scripts/render.mjs` — 渲染驱动：起 Vite 开发服务器 → Puppeteer 打开无头页 → 等 `Renderer` 完成

## 重新渲染

```bash
cd ~/workspace/ddia-animation-demo/ch01/motion-canvas
node scripts/render.mjs   # 产物在 ./output/replication-lag.mp4，约 40 秒
```

## 为什么要无头页（关键坑）

Motion Canvas 3.17.2 没有官方 CLI 渲染；`@motion-canvas/ffmpeg` 导出器必须在
浏览器里跑，帧通过 Vite HMR WebSocket 传给服务端 ffmpeg。所以渲染 = Vite
开发服务器 + 无头 Chromium，用公开 API `Renderer#render` 直接驱动，不点编辑器 UI。

- 无头逻辑必须放在 `src/headless.ts` 里、由 HTML 以 `<script src="/src/headless.ts">`
  引入：`public/` 下的文件 Vite 原样 serving，不改写 bare import，
  内联脚本里 `import ... from '@motion-canvas/core'` 会报
  `Failed to resolve module specifier`。
- `RendererSettings.size` 必须是 `Vector2` 对象（`new Vector2(1280, 720)`），
  传 `[1280, 720]` 数组会使服务端算出 `NaNxNaN`，ffmpeg 失败、渲染返回 Error。
- 渲染错误不抛异常，只走 `Renderer.onFinished` 的 `RendererResult.Error`；
  具体原因在 `project.logger.onLogged` 里，`headless.ts` 已把它打到页面 console。

## 故事线（44 秒）

1. 开场：拓扑入场（客户端 → 主库 → 从库 A/B）
2. 写主库：蓝包 `42` 飞向主库，主库 `x=41 → 42`
3. 复制中：延迟计数 `0 → 180 ms`，从库仍是红字旧值 `x=41`
4. 立刻读从库：红字大字 `读到旧值！x = 41`
5. 复制追上：从库依次变绿 `x=42`，已同步
6. 再读一次：绿字 `读到新值 x = 42`
7. 小结卡片：异步复制低延迟+短暂不一致；同步复制强一致+高延迟
