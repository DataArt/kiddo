import { GameObject, GameObjectState, GameObjectType } from './game-object';
import { Coords } from '../../common/entities';

export interface Mine extends GameObject {
  type: GameObjectType.MINE;
  state: GameObjectState.DEFAULT;
  position: Coords;
  hitboxSize: 0;
  isMovable: false;
  isPickable: true;
  id: number;
}
