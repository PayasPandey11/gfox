import { useEffect, useRef } from 'react';
import type { Live2DModel } from '../app/types';
const useLive2DModel = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const modelRef = useRef<Live2DModel | null>(null);

  useEffect(() => {



  

    const app = new (window as any).PIXI.Application({
      view: canvasRef.current,
      backgroundColor: 0xffffff,
      backgroundAlpha: 0,// Ensures full transparency
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

        model.scale.set(0.25);
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
          const hairTyoes = ["WhiteHairBraids","BlackBraids","WhiteHair","WhitePonytail","Hat"];
          const facials = ["Cry","Anger","Love","Red","No"];
          const acts = ["Game","Game","Game","EatEat","Bear","PenFingers"];
          const setting = ["Pillow","Box","Coat"];
          const all_expressions = [...hairTyoes, ...facials, ...acts, ...setting];
          const select_random_expression = all_expressions[Math.floor(Math.random() * all_expressions.length)];
          const all_motions = ["Sleep","Eat"];
          const select_random_motion = all_motions[Math.floor(Math.random() * all_motions.length)];
          const motion_or_expression = Math.random() < 0.5 ? "expression" : "motion";
          if (motion_or_expression === "expression") {
            console.log("select_random_expression",select_random_expression);
            model.expression(select_random_expression);
          } else {
            console.log("select_random_motion",select_random_motion);
            // model.motion(select_random_motion);
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