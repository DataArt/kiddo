import { GameObject, GameObjectAdditionalState, GameObjectState, GameObjectType } from './game-object';
import { Direction } from '../../common/entities';
import { Coords } from '../../common/entities';

export interface Person extends GameObject {
  type: GameObjectType.PERSON;
  state: GameObjectState.DEFAULT;
  position: Coords;
  direction: Direction;
  hitboxSize: 1;
  isMovable: true;
  isPickable: false;
  id: number;
  additionalState: GameObjectAdditionalState;
}
