import { useEffect, useRef } from 'react';
import type { Live2DModel } from '../app/types';
const useLive2DModel = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const modelRef = useRef<Live2DModel | null>(null);

  useEffect(() => {
    const app = new (window as any).PIXI.Application({
      view: canvasRef.current,
      backgroundColor: 0x000000,
      width: window.innerWidth * 0.85,
      height: window.innerHeight,
      antialias: true,
    });

    const loadModel = async () => {
      try {
        const model = await (window as any).PIXI.live2d.Live2DModel.from(
          '/models/model_bear/bear_Pajama.model3.json',
          { cdi: '/models/model_bear/bear_Pajama.cdi3.json' }
        );

        console.log('Model loaded successfully:', model);
        modelRef.current = model;

        model.scale.set(0.25);
        model.anchor.set(0.5);
        model.position.set(app.screen.width / 2, app.screen.height / 2);
        model.buttonMode = true;
        model.interactive = true;
        model.draggable = true;

        app.stage.addChild(model);

        const onResize = () => {
          app.renderer.resize(window.innerWidth * 0.85, window.innerHeight);
          model.position.set(app.screen.width / 2, app.screen.height / 2);
        };

        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
      } catch (e) {
        console.error('Failed to load model:', e);
      }
    };

    loadModel();
    return () => app.destroy(true);
  }, [canvasRef]);

  return modelRef;
};

export default useLive2DModel;