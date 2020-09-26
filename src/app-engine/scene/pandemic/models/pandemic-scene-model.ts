import { SceneType } from '../../common/models/scene-type.enum';
import { WinButton, CheckingLogic } from '../../common/entities';
import { Tile, Player, GameObject } from '../entities';

export interface PandemicSceneModel {
  sceneType: SceneType.PANDEMIC;
  player: Player;
  gameField: Tile[][];
  gameObjects: GameObject[];
  terraIncognita: boolean;
  maze: string[][];
  shouldPutOnMask: boolean;
  productsPicked: boolean;
  handsWashed: boolean;
  maskIsOn: boolean;
  taskDescription: string;
  sceneInitialScript: string;
  checkingLogic: CheckingLogic;
  winButton: WinButton;
}
