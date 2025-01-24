import Script from 'next/script';

const Live2DScripts = () => (
  <>
    <Script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.3.3/pixi.min.js" strategy="beforeInteractive" />
    <Script src="https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js" strategy="beforeInteractive" />
    <Script src="https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js" strategy="beforeInteractive" />
    <Script src="https://cdn.jsdelivr.net/npm/pixi-live2d-display/dist/index.min.js" strategy="beforeInteractive" />
  </>
);

export default Live2DScripts;