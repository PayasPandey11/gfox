// src/app/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import type { Live2DModel} from './types';


export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<Live2DModel | null>(null);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const questions = [
    { 
      id: 'topLeft', 
      text: 'Cry', 
      audioSrc: '/audio/a.mp3',
      position: 'top-4 left-4',
      action: () => {
        if (modelRef.current) {
          try {
            modelRef.current.internalModel.coreModel.setParameterValueById('Param12', 1); // cry parameter
            modelRef.current.internalModel.coreModel.setParameterValueById('Part16', 1); // cry part
      

            modelRef.current.expression('cry');
            
            setTimeout(() => {
              if (modelRef.current) {
                modelRef.current.internalModel.coreModel.setParameterValueById('Param12', 0);
                modelRef.current.internalModel.coreModel.setParameterValueById('Part16', 0);
              }
            }, 1383); // Match the motion duration
          } catch (error) {
            console.error('Failed to trigger cry motion:', error);
          }
        }
      }
    },
    { 
      id: 'topRight', 
      text: 'Happy', 
      audioSrc: '/audio/happy.mp3',
      position: 'top-4 right-4',
      action: () => {
        if (modelRef.current) {
          modelRef.current.internalModel.coreModel.setParameterValueById('ParamEyeLSmile', 1);
          modelRef.current.internalModel.coreModel.setParameterValueById('ParamEyeRSmile', 1);
          
          setTimeout(() => {
            if (modelRef.current) {
              modelRef.current.internalModel.coreModel.setParameterValueById('ParamEyeLSmile', 0);
              modelRef.current.internalModel.coreModel.setParameterValueById('ParamEyeRSmile', 0);
            }
          }, 3000);
        }
      }
    },
    { 
      id: 'bottomLeft', 
      text: 'Blush', 
      audioSrc: '/audio/blush.mp3',
      position: 'bottom-4 left-4',
      action: () => {
        if (modelRef.current) {
          modelRef.current.internalModel.coreModel.setParameterValueById('ParamCheek', 1);
          
          setTimeout(() => {
            if (modelRef.current) {
              modelRef.current.internalModel.coreModel.setParameterValueById('ParamCheek', 0);
            }
          }, 3000);
        }
      }
    },
    { 
      id: 'bottomRight', 
      text: 'Angry', 
      audioSrc: '/audio/angry.mp3',
      position: 'bottom-4 right-4',
      action: () => {
        if (modelRef.current) {
          // Trigger angry expression
          modelRef.current.internalModel.coreModel.setParameterValueById('Param9', 1); // angry parameter
          modelRef.current.internalModel.coreModel.setParameterValueById('Part4', 1); // angry part
          
          // Reset after 3 seconds
          setTimeout(() => {
            if (modelRef.current) {
              modelRef.current.internalModel.coreModel.setParameterValueById('Param9', 0);
              modelRef.current.internalModel.coreModel.setParameterValueById('Part4', 0);
            }
          }, 3000);
        }
      }
    }
  ];

  const playAudio = (audioSrc: string, buttonId: string, action?: () => void) => {
    if (!modelRef.current) return;
  
    const audio = new Audio(audioSrc);
    setActiveButton(buttonId);
  
    // Create audio context for lip-sync analysis
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const audioSource = audioContext.createMediaElementSource(audio);
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
  
    // Setup lip-sync parameter animation
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
  
    const animateLipSync = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate average frequency amplitude
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      
      // Map amplitude to lip-sync parameters
      if (modelRef.current) {
        modelRef.current.internalModel.coreModel.setParameterValueById(
          'ParamMouthOpenY', 
          average / 128 // Normalize to 0-1 range
        );
      }
  
      if (!audio.ended) {
        requestAnimationFrame(animateLipSync);
      } else {
        // Reset mouth parameter when audio ends
        if (modelRef.current) {
          modelRef.current.internalModel.coreModel.setParameterValueById('ParamMouthOpenY', 0);
        }
        setActiveButton(null);
      }
    };
  
    audio.play();
    if (action) action();
    animateLipSync();
  };

  useEffect(() => {
    const app = new (window as any).PIXI.Application({
      view: canvasRef.current,
      backgroundColor: 0x000000,
      width: window.innerWidth * 0.85,
      height: window.innerHeight,
      antialias: true
    });

    const loadModel = async () => {
      try {
        const model = await (window as any).PIXI.live2d.Live2DModel.from(
          '/models/model_bear/bear_Pajama.model3.json'
        );
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
    return () => {
      app.destroy(true);
    };
  }, []);

  return (
    <main className="flex min-h-screen bg-black">
      {questions.map((question) => (
        <button 
          key={question.id}
          onClick={() => playAudio(question.audioSrc, question.id, question.action)}
          className={`
            fixed w-48 p-3 rounded-lg text-white transition-all duration-300 
            ${question.position}
            ${activeButton === question.id 
              ? 'bg-blue-700 scale-105' 
              : 'bg-blue-500 hover:bg-blue-600'}
          `}
        >
          {question.text}
        </button>
      ))}
      
      <div className="w-[85%]">
        <canvas ref={canvasRef} className="h-screen" />
      </div>
      
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.3.3/pixi.min.js" strategy="beforeInteractive" />
      <Script src="https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/pixi-live2d-display/dist/index.min.js" strategy="beforeInteractive" />
    </main>
  );
}