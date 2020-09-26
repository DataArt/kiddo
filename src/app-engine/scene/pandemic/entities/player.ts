import { Coords, Direction } from '../../common/entities';
import { GameObject, GameObjectState } from './game-object';


export interface Player extends GameObject {
  id: 0;
  position: Coords;
  state: GameObjectState;
  direction: Direction;
  inventory: GameObject[];
  hitboxSize: 0;
}
