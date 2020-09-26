import { SceneType } from '../../common/models/scene-type.enum';
import { ConfigGameObject } from '../entities';
import { Tile } from '../entities';
import { TileSceneWinCondition, WinButton } from '../../common/entities';
import { SceneConfig } from '../../common/scene-config';

export interface RaccoonSceneConfig extends SceneConfig {
  sceneType: SceneType.RACCOON;
  generatingFunc?: string;
  player: ConfigGameObject;
  gameField: Tile[][];
  maze?: {
    dimension: number,
    maxExits: number,
  };
  cookies: ConfigGameObject[];
  monsters: ConfigGameObject[];
  gates: ConfigGameObject[];
  keys: ConfigGameObject[];
  turrets: ConfigGameObject[];
  mines: ConfigGameObject[];
  winCondition: TileSceneWinCondition;
  winButton?: WinButton;
  initialScript: string;
  taskDescription: string;
}
