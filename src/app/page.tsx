'use client';

import { useRef, useState } from 'react';
import InteractionButton from '../components/InteractionButton';
import useLive2DModel from '../hooks/useLive2DModel';
import { QUESTIONS } from '../constants/questions';
import Live2DScripts from '@/components/Live2DScripts';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useLive2DModel(canvasRef);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const playAudio = (audioSrc: string, buttonId: string, action?: () => void) => {
    if (!modelRef.current) return;

    const audio = new Audio(audioSrc);
    setActiveButton(buttonId);

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const audioSource = audioContext.createMediaElementSource(audio);
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const animateLipSync = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      
      if (modelRef.current) {
        modelRef.current.internalModel.coreModel.setParameterValueById(
          'ParamMouthOpenY', 
          average / 128
        );
      }

      if (!audio.ended) {
        requestAnimationFrame(animateLipSync);
      } else {
        modelRef.current?.internalModel.coreModel.setParameterValueById('ParamMouthOpenY', 0);
        setActiveButton(null);
      }
    };

    audio.play();
    action?.();
    animateLipSync();
  };

  return (
    <main className="flex min-h-screen bg-black">
      {QUESTIONS.map((question) => (
        <InteractionButton
          key={question.id}
          id={question.id}
          text={question.text}
          position={question.position}
          isActive={activeButton === question.id}
          onClick={() => playAudio(
            question.audioSrc, 
            question.id, 
            () => question.action(modelRef.current) // Pass modelRef.current to the action
          )}
        />
      ))}
      
      <div className="w-[85%]">
        <canvas ref={canvasRef} className="h-screen" />
      </div>
      
      <Live2DScripts/>
    </main>
  );
}