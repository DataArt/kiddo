import { GameObject, GameObjectState, GameObjectType } from './game-object';
import { Coords } from '../../common/entities';

export interface Cookie extends GameObject {
  type: GameObjectType.COOKIE;
  state: GameObjectState.DEFAULT;
  position: Coords;
  hitboxSize: 0;
  isMovable: false;
  isPickable: true;
  isCompulsory: true;
  id: number;
}
