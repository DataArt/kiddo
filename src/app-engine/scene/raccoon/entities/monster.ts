import { GameObject, GameObjectState, GameObjectType } from './game-object';
import { Direction } from '../../common/entities';
import { Coords } from '../../common/entities';

export interface Monster extends GameObject {
  type: GameObjectType.MONSTER;
  state: GameObjectState.DEFAULT;
  position: Coords;
  direction: Direction;
  hitboxSize: 0;
  isMovable: true;
  isPickable: false;
  chasing: boolean;
  id: number;
}
