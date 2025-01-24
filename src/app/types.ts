declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export type Live2DModel = {
  motion: (name: string) => void;
  expression: (name: string) => void;
  internalModel: {
    coreModel: {
      setParameterValueById: (param: string, value: number) => void;
      stopMotion: () => void;
    };
    motionManager: {
      motionPreload: boolean;
      definitions: any;
      groups: any;
      motionData: any;
    };
  };
  scale: { set: (scale: number) => void };
  anchor: { set: (position: number) => void };
  position: { set: (position: { x: number; y: number }) => void };
  buttonMode: boolean;
  interactive: boolean;
  draggable: boolean;
};
   
