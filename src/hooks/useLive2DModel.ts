import { useEffect, useRef } from 'react';
import type { Live2DModel } from '../app/types';
const useLive2DModel = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const modelRef = useRef<Live2DModel | null>(null);

  useEffect(() => {



  

    const app = new (window as any).PIXI.Application({
      view: canvasRef.current,
      backgroundColor: 0x000000,
      antialias: true,
      width: 1000,
      height: 1000,
    });

    const loadModel = async () => {
      try {
        const cdiResponse = await fetch('/models/model_bear/bear Pajama.cdi3.json');
        const cdiData = await cdiResponse.json();
        const jsonResponse = await fetch('/models/model_bear/bear_Pajama.model3.json');
        const jsonData = await jsonResponse.json();
        console.log(cdiData);
        console.log(jsonData);
        console.log(jsonData.HitAreas);
        const model = await (window as any).PIXI.live2d.Live2DModel.from(
          '/models/model_bear/bear_Pajama.model3.json',
          { 
            settings: {
              cdi: cdiData  // Inject CDI data directly
            },
            hitAreas: jsonData.HitAreas,
            textureOption: {
              scale: 2 // Renders textures at 2x resolution
            }
          }
        );

        modelRef.current = model;

        model.scale.set(0.21);
        model.anchor.set(0.5);
        model.position.set(app.screen.width/2, app.screen.height/2);
        model.buttonMode = true;
        model.interactive = true;
        model.draggable = true;
        model.hitAreas = jsonData.HitAreas;

        

        // Add hit area interaction
        model.on('pointerdown', (event: any) => {
          console.log("event",event);
          console.log("model",model.isHit);
          console.log(event.data.global.x, event.data.global.y);
          const hitAreas = model.hitAreas;
          console.log("hitAreas",hitAreas);
          const hitArea = model.internalModel.hitTest(event.data.global.x, event.data.global.y);
          if (hitArea) {
            console.log('Hit area clicked:', hitArea);
            triggerMotionOrExpression(hitArea);
          }
        });

        app.stage.addChild(model);

        const onResize = () => {
          model.position.set(app.screen.width/2, app.screen.height/2);
          //app.renderer.resize(window.outerWidth, window.outerHeight);
         
        };

        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
      } catch (e) {
        console.error('Failed to load model:', e);
      }
    };

    const triggerMotionOrExpression = (hitArea: string) => {
      const model = modelRef.current;
      if (!model) return;

      switch (hitArea) {
        case 'Head':
          model.motion('Sleep'); // Trigger a motion
          break;
        case 'Body':
          model.expression('Happy'); // Trigger an expression
          break;
        case 'Arm':
          model.motion('Wave'); // Trigger another motion
          break;
        default:
          console.warn('Unknown hit area:', hitArea);
      }
    };

    loadModel();
    return () => app.destroy(true);
  }, [canvasRef]);

  return modelRef;
};

export default useLive2DModel;