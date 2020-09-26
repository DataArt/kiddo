import { SceneType } from '../../common/models/scene-type.enum';
import { TileSceneWinCondition, WinButton } from '../../common/entities';
import { ConfigGameObject, Player, Tile } from '../entities';

export interface PandemicSceneConfig {
  sceneType: SceneType.PANDEMIC;
  generatingFunc?: string;
  player: Player;
  gameField: Tile[][];
  maskIsOn: boolean;
  handsWashed: boolean;
  productsPicked: boolean;
  shouldPutOnMask: boolean;
  sanitizers: ConfigGameObject[];
  masks: ConfigGameObject[];
  viruses: ConfigGameObject[];
  people: ConfigGameObject[];
  winCondition: TileSceneWinCondition;
  winButtonDetails: WinButton;
  initialScript: string;
  taskDescription: string;
}
