import { SceneType } from '../../common/models/scene-type.enum';
import { Tile, GameObject, Player, CustomeTile } from '../entities';
import { CheckingLogic } from '../../common/entities';

export interface RaccoonSceneModel {
  sceneType: SceneType.RACCOON;
  player: Player;
  gameField: Tile[][];
  gameObjects: GameObject[];
  terraIncognita: boolean;
  maze: string[][];
  checkingLogic: CheckingLogic;
  customeTiles?: CustomeTile[];
}
