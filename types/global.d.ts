import * as PIXI from 'pixi.js';

declare global {
  interface Window {
    PIXI: typeof PIXI;
    Live2DModel: any;
  }
}