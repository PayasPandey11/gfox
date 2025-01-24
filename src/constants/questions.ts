import type { Live2DModel } from '../app/types';

export const QUESTIONS = [
    { 
      id: 'topLeft', 
      text: 'Sleep', 
      audioSrc: '/audio/a.mp3',
      position: { top: '1rem', left: '1rem' },
      action: (model: Live2DModel | null) => {
        if (!model) {
            console.error('Model is not loaded');
            return;
          }
        try {
          model.motion('Eat');
        } catch (error) {
          console.error('Failed to trigger Eat motion:', error);
        }
      }
    },
    { 
      id: 'topRight', 
      text: 'Eat', 
      audioSrc: '/audio/a.mp3',
      position: { top: '1rem', right: '1rem' },
      action: (model: Live2DModel | null) => {
        if (!model) {
            console.error('Model is not loaded');
            return;
          }
        try {
          model.motion('Eat');
        } catch (error) {
          console.error('Failed to trigger Eat motion:', error);
        }
      }
    },
    { 
      id: 'bottomLeft', 
      text: 'Greet', 
      audioSrc: '/audio/a.mp3',
      position: { bottom: '1rem', left: '1rem' },
      action: (model: Live2DModel | null) => {
        if (!model) {
            console.error('Model is not loaded');
            return;
          }
        try {
          model.motion('Greet');
        } catch (error) {
          console.error('Failed to trigger Greet motion:', error);
        }
      }
    },
    { 
      id: 'bottomRight', 
      text: 'Angry', 
      audioSrc: '/audio/angry.mp3',
      position: { bottom: '1rem', right: '1rem' },
      action: (model: Live2DModel | null) => {
        if (!model) return;
        
        model.expression('Hat');
        setTimeout(() => {
          model.expression('Coat');
        }, 3000);
      }
    }
  ];