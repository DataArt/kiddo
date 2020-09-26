import { SceneType } from './scene-type.enum';
import { CheckingLogic } from '../entities';

export interface SceneModel {
  sceneType: SceneType;
  checkingLogic: CheckingLogic;
}
