// 放在 motion-canvas/vite.config.ts。
// 依赖（版本锁定，全书不要中途升级）：
//   dependencies:    @motion-canvas/core、@motion-canvas/2d（同一版本，如 3.17.2）、@motion-canvas/ffmpeg
//   devDependencies: @motion-canvas/ui、@motion-canvas/vite-plugin（同一版本）、vite、puppeteer、typescript
import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

export default defineConfig({
  plugins: [motionCanvas(), ffmpeg()],
  // 渲染时（render.mjs 启动 Vite 时设 MC_RENDER_NO_WATCH=1）不监视源码。否则渲染中途改了 project.ts、lib/theme.ts
  // 这类文件，Vite 会整页刷新、从头再渲染一遍，而上一段渲染的 ffmpeg 没人结束，关掉 Vite 时它把半截文件写回
  // output/<场景>.mp4——渲染报成功、QA 0 error，落盘文件却被截断。平时 npm start 开编辑器照常热更新。
  server: process.env.MC_RENDER_NO_WATCH ? {watch: {ignored: ['**/*']}} : {},
});
