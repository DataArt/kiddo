import { SceneModel } from '../models/scene-model';
import { GameStatistics } from '../entities';
import { SceneType } from '../models/scene-type.enum';

export interface SceneReader {
  sceneModel: SceneModel;

  /**
   * @description method used to hook the current scene model to the reader
   */
  init(): void;

  getSceneType(): SceneType;
  getGameFailMessage(): string;
  getGameStatistics(): GameStatistics;
  sceneIsPlaybackable(): boolean;
}
