import { GameObject, GameObjectAdditionalState, GameObjectState, GameObjectType } from './game-object';
import { Coords } from '../../common/entities';

export interface Gate extends GameObject {
  type: GameObjectType.GATES;
  state: GameObjectState.DEFAULT;
  additionalState: GameObjectAdditionalState;
  position: Coords;
  hitboxSize: 0;
  isMovable: false;
  isPickable: false;
  id: number;
}
