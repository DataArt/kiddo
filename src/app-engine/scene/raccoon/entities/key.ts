import { GameObject, GameObjectAdditionalState, GameObjectState, GameObjectType } from './game-object';
import { Coords } from '../../common/entities';

export interface Key extends GameObject {
  type: GameObjectType.KEY;
  state: GameObjectState.DEFAULT;
  additionalState: GameObjectAdditionalState;
  position: Coords;
  hitboxSize: 0;
  isMovable: false;
  isPickable: true;
  id: number;
}
