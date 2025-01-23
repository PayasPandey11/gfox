declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export interface Live2DModel {
  internalModel: {
    coreModel: {
      setParameterValueById: (id: string, value: number) => void;
      parameters: Array<{ id: string }>;
    };
    motionGroups: Record<string, any>;
    parameters?: {
      values: {
        ParamMouthOpenY: number;
        [key: string]: number;
      };
    };
  };
  scale: {
    set: (scale: number) => void;
  };
  anchor: {
    set: (anchor: number) => void;
  };
  position: {
    set: (x: number, y: number) => void;
  };
  buttonMode: boolean;
  interactive: boolean;
  draggable: boolean;
  expression: (name: string) => void;
  motion: (name: any) => void;
}
   
