// Headless render entry point. Loaded as /src/headless.ts so Vite rewrites
// bare imports (e.g. '@motion-canvas/core'). The HTML file in public/ is
// served as-is by Vite, so bare specifiers do NOT work from there.
// @ts-ignore - ?project is a Vite virtual module with no type declarations
import projectModule from './project?project';
import {Renderer, Vector2} from '@motion-canvas/core';

const setStatus = (s: string) => {
  document.title = s;
  document.getElementById('status')!.textContent = s;
  (window as any).__renderStatus = s;
};
(window as any).__renderStatus = 'starting';

try {
  // In serve mode the ?project module top-level-awaits editorBootstrap,
  // so the default export is the Project itself.
  const project = await projectModule;
  setStatus('project loaded: ' + project.name);

  // Single-scene render: ?scene=<name> filters project.scenes down to that
  // scene before the Renderer is created (project.scenes is a plain array).
  // Without the param, all scenes render concatenated into one file (the
  // old behaviour: 44s replication-lag + 30s + 30s cards = 104s in one mp4).
  const sceneName = new URLSearchParams(location.search).get('scene');
  if (sceneName) {
    const before = project.scenes.length;
    project.scenes = project.scenes.filter((d: any) => d.name === sceneName);
    if (project.scenes.length === 0) {
      throw new Error(
        `scene "${sceneName}" not found (have ${before} scenes)`,
      );
    }
    setStatus(`single scene: ${sceneName}`);
  }

  // Surface Motion Canvas logger output (renderer errors land here, not
  // as thrown exceptions) so the headless driver can see them.
  const logLines: string[] = [];
  project.logger.onLogged.subscribe((payload: any) => {
    const line = JSON.stringify(payload);
    logLines.push(line);
    (window as any).__renderLog = logLines;
    console.error('[mc-logger]', line.slice(0, 1000));
  });

  const renderer = new Renderer(project);
  renderer.onFinished.subscribe(result => {
    // RendererResult: 0 = Success, 1 = Error, 2 = Aborted
    (window as any).__renderResult = result;
    setStatus('finished:' + result);
  });
  renderer.onFrameChanged.subscribe(frame => {
    (window as any).__renderFrame = frame;
  });

  const base = project.meta.getFullRenderingSettings();
  const settings = {
    ...base,
    name: sceneName ?? 'replication-lag',
    size: new Vector2(1280, 720),
    resolutionScale: 1,
    fps: 30,
    colorSpace: 'srgb',
    background: '#0F172A',
    exporter: {
      name: '@motion-canvas/ffmpeg',
      options: {fastStart: true, includeAudio: false},
    },
  };
  (window as any).__renderSettings = settings;
  setStatus('rendering...');
  await renderer.render(settings);
  setStatus('render() resolved');
} catch (e: any) {
  (window as any).__renderError = String((e && e.stack) || e);
  setStatus('error: ' + (e && e.message));
}
