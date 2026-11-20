// 放在 motion-canvas/vite.config.ts。
// 依赖（版本锁定，全书不要中途升级）：
//   dependencies:    @motion-canvas/core、@motion-canvas/2d（同一版本，如 3.17.2）、@motion-canvas/ffmpeg
//   devDependencies: @motion-canvas/ui、@motion-canvas/vite-plugin（同一版本）、vite、puppeteer、typescript
import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

export default defineConfig({
  plugins: [motionCanvas(), ffmpeg()],
});
