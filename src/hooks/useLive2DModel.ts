import { useEffect, useRef } from 'react';
import type { Live2DModel } from '../app/types';
import { Renderer } from '@pixi/core';
import { InteractionManager } from '@pixi/interaction';

Renderer.registerPlugin('interaction', InteractionManager);

const useLive2DModel = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const modelRef = useRef<Live2DModel | null>(null);

  useEffect(() => {
    const app = new (window as any).PIXI.Application({
      view: canvasRef.current,
      transparent: true,
      antialias: true,
      resizeTo: window,
      autoDensity: true,
      resolution: window.devicePixelRatio || 1,
    });

    const loadModel = async () => {
      try {
        const [cdiData, jsonData] = await Promise.all([
          fetch('/models/model_bear/bear Pajama.cdi3.json').then(res => res.json()),
          fetch('/models/model_bear/bear_Pajama.model3.json').then(res => res.json())
        ]);

        const model = await (window as any).PIXI.live2d.Live2DModel.from(
          '/models/model_bear/bear_Pajama.model3.json',
          { 
            settings: { cdi: cdiData },
            hitAreas: jsonData.HitAreas,
          }
        );

        modelRef.current = model;

        // Calculate position with chatbox offset
        const calculatePosition = () => {
          const chatboxWidth = 25 * 16; // Convert 25rem to pixels (1rem = 16px)
          const effectiveWidth = app.screen.width - chatboxWidth;
          return {
            x: effectiveWidth / 2,
            y: app.screen.height / 2
          };
        };

        // Scaling calculations
        const calculateScale = () => {
          const padding = 80;
          const chatboxWidth = 25 * 16; // 25rem in pixels
          const maxWidth = (app.screen.width - chatboxWidth) - padding;
          const maxHeight = app.screen.height - padding;
          const modelAspect = model.width / model.height;
          const windowAspect = maxWidth / maxHeight;

          let scale = 1;
          if (modelAspect > windowAspect) {
            scale = maxWidth / model.width;
          } else {
            scale = maxHeight / model.height;
          }

          return scale * 1.25;
        };

        // Initial setup
        const initialScale = calculateScale();
        const initialPosition = calculatePosition();
        model.scale.set(initialScale);
        model.anchor.set(0.5);
        model.position.set(initialPosition.x, initialPosition.y);
        model.interactive = true;

        app.stage.addChild(model);

        // Resize handler
        const onResize = () => {
          const newScale = calculateScale();
          const newPosition = calculatePosition();
          
          model.scale.set(newScale);
          model.position.set(newPosition.x, newPosition.y);
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