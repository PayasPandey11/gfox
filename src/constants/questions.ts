import type { Live2DModel } from '../app/types';

// Motion controller state
let abortController: AbortController | null = null;
const DEFAULT_PEN_VALUE = 1; // Default visible state from CDI

export const QUESTIONS = [
    { 
      id: 'topLeft', 
      text: 'Sleep', 
      audioSrc: '/audio/a.mp3',
      position: { top: '1rem', left: '1rem' },
      action: async (model: Live2DModel | null) => {
        if (!model) return;
        
        // Abort previous animation and reset
        await resetToDefault(model);
        
        try {
          // Start new motion
          model.motion('Sleep');
          // Hide pen and ensure default parameters
          setParameter(model, 'Param116', 0);  // Hide pen
        } catch (error) {
          console.error('Sleep motion failed:', error);
        }
      }
    },
    { 
      id: 'topRight', 
      text: 'Eat', 
      audioSrc: '/audio/a.mp3',
      position: { top: '1rem', right: '1rem' },
      action: async (model: Live2DModel | null) => {
        if (!model) return;
        
        await resetToDefault(model);
        
        try {
          model.motion('Eat');
          // Animate fingers with abort control
          animateParameter(model, 'Param128', [
            [0, 0], [0.3, 0.8], [0.6, 0]
          ]);
        } catch (error) {
          console.error('Eat motion failed:', error);
        }
      }
    },
    { 
      id: 'bottomLeft', 
      text: 'Greet', 
      audioSrc: '/audio/a.mp3',
      position: { bottom: '1rem', left: '1rem' },
      action: async (model: Live2DModel | null) => {
        if (!model) return;
        
        //await resetToDefault(model);
        
        try {
            model.internalModel.coreModel.setParameterValueById('Param116', 0);

          model.motion('Greet');
          model.internalModel.coreModel.setParameterValueById('Param116', 0);

          setParameter(model, 'Param116', 0);  // Hide pen during greeting
    
        } catch (error) {
          console.error('Greet motion failed:', error);
        }
      }
    },
    { 
      id: 'bottomRight', 
      text: 'Angry', 
      audioSrc: '/audio/angry.mp3',
      position: { bottom: '1rem', right: '1rem' },
      action: async (model: Live2DModel | null) => {
        if (!model) return;
        
        await resetToDefault(model);
        
        try {
            
          // Expression sequence with proper cleanup
          model.expression('PenFingers');
          model.internalModel.coreModel.setParameterValueById('Param116', 0);
  
          setTimeout(() => resetToDefault(model), 3000);
        } catch (error) {
          console.error('Angry motion failed:', error);
        }
      }
    }
];

// Core parameter setter
function setParameter(model: Live2DModel, paramId: string, value: number) {
  model.internalModel.coreModel.setParameterValueById(paramId, value);
}

// Animation helper with abort control
function animateParameter(
  model: Live2DModel,
  paramId: string,
  keyframes: [number, number][],
  duration = 2000
) {
  abortController = new AbortController();
  
  keyframes.forEach(([time, value]) => {
    const timeout = setTimeout(() => {
      if (!abortController?.signal.aborted) {
        setParameter(model, paramId, value);
      }
    }, time * duration);

    abortController?.signal.addEventListener('abort', () => {
      clearTimeout(timeout);
    });
  });
}

// Reset function with proper cleanup
async function resetToDefault(model: Live2DModel) {
  // Cancel any ongoing animations
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
  
//   // Stop current motions
//   model.internalModel.coreModel.stopMotion();
  
  // Reset parameters to default
  setParameter(model, 'Param26', 0);   // Arm
  setParameter(model, 'Param27', 0);   // Forearm
  setParameter(model, 'Param28', 0);   // Hand
  setParameter(model, 'Param128', 0);  // Fingers
  setParameter(model, 'Param116', 0);  // Show pen
  
  // Add more parameter resets as needed
  await new Promise(resolve => requestAnimationFrame(resolve));
}