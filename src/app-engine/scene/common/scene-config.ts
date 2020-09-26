import { SceneType } from './models/scene-type.enum';
import { WinButton } from './entities';

export interface SceneConfig {
  sceneType: SceneType;
  generatingFunc?: string;
  checkingFunc?: string;
  winButton?: WinButton;
  initialScript?: string;
  taskDescription?: string;
}
