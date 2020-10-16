import { GameObject, GameObjectState, GameObjectType } from './game-object';
import { Coords } from '../../common/entities';

export interface Mask extends GameObject {
  type: GameObjectType.MASK;
  state: GameObjectState.DEFAULT;
  position: Coords;
  hitboxSize: 0;
  isMovable: false;
  isPickable: true;
  isCompulsory: true;
  id: number;
}
