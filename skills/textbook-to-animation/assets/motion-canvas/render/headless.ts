// 无头渲染入口：放在 motion-canvas/src/headless.ts，由 public/headless.html 加载。
// Motion Canvas 3.x 没有官方渲染 CLI；@motion-canvas/ffmpeg 导出器必须在浏览器里跑，
// 帧经 Vite HMR WebSocket 传给服务端 ffmpeg。所以这里直接调用公开 API Renderer#render。
//
// URL 参数：?scene=<场景名>（只渲染这个场景，产物为 output/<场景名>.mp4；不给则整个 project 拼成一个文件）
//           &w=1280&h=720&fps=30
//           &qa=1：QA 模式，beat() 会逐拍检查文字重叠/出画/动画超时，结果在 window.__qaReport
// 渲染状态写在 window.__render* 上，供 motion-canvas/scripts/render.mjs 轮询。

// @ts-ignore —— ?project 是 Vite 虚拟模块，没有类型声明
import projectModule from './project?project';
import {Renderer, Vector2} from '@motion-canvas/core';
import {T} from './lib/theme';

const w = window as any;
const setStatus = (s: string) => {
  document.title = s;
  const el = document.getElementById('status');
  if (el) el.textContent = s;
  w.__renderStatus = s;
};
setStatus('starting');

try {
  // dev server 模式下 ?project 模块顶层 await 了编辑器引导，默认导出就是 Project
  const project = await projectModule;
  const params = new URLSearchParams(location.search);
  const sceneName = params.get('scene');
  const width = Number(params.get('w') ?? 1280);
  const height = Number(params.get('h') ?? 720);
  const fps = Number(params.get('fps') ?? 30);
  if (params.get('qa') === '1') {
    w.__MC_QA__ = true;
    w.__qaReport = [];
  }

  if (sceneName) {
    const all = project.scenes.length;
    project.scenes = project.scenes.filter((d: any) => d.name === sceneName);
    if (project.scenes.length === 0) {
      throw new Error(`scene "${sceneName}" not found（project 里共 ${all} 个场景）`);
    }
  }

  // 渲染错误不会抛异常，只会进 logger；转发到 console，驱动脚本才看得到原因
  const logs: string[] = [];
  project.logger.onLogged.subscribe((payload: any) => {
    const line = JSON.stringify(payload);
    logs.push(line);
    w.__renderLog = logs;
    console.error('[mc-logger]', line.slice(0, 1000));
  });

  const renderer = new Renderer(project);
  renderer.onFinished.subscribe((result: number) => {
    // 0 = Success, 1 = Error, 2 = Aborted
    w.__renderResult = result;
    setStatus('finished:' + result);
  });
  renderer.onFrameChanged.subscribe((frame: number) => {
    w.__renderFrame = frame;
  });

  const settings = {
    ...project.meta.getFullRenderingSettings(),
    name: sceneName ?? 'project',
    size: new Vector2(width, height), // 必须是 Vector2；传数组会算出 NaN，ffmpeg 失败
    resolutionScale: 1,
    fps,
    colorSpace: 'srgb',
    background: T.bg,
    exporter: {
      name: '@motion-canvas/ffmpeg',
      // 静音渲染：旁白在拼接时统一混入
      options: {fastStart: true, includeAudio: false},
    },
  };
  setStatus('rendering...');
  await renderer.render(settings as any);
} catch (e: any) {
  w.__renderError = String((e && e.stack) || e);
  setStatus('error: ' + (e && e.message));
}
