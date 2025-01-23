
   
   export interface Live2DModel {
    scale: { set: (scale: number) => void };
    anchor: { set: (anchor: number) => void };
    position: { set: (x: number, y: number) => void };
    buttonMode: boolean;
    interactive: boolean;
    draggable: boolean;
    on: (event: string, callback: (areas: string[]) => void) => void;
    motion: (name: string) => void;
    expression: (name: string) => void;
    internalModel?: {
      parameters?: {
        values: {
          ParamMouthOpenY: number;
        };
      };
    };
   }
   
