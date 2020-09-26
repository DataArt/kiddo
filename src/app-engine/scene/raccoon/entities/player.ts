import { GameObject, GameObjectAdditionalState, GameObjectState } from './game-object';
import { Direction, Coords } from '../../common/entities';

export interface Player extends GameObject {
  id: 0;
  position: Coords;
  state: GameObjectState;
  additionalState: GameObjectAdditionalState;
  direction: Direction;
  inventory: GameObject[];
  hitboxSize: 0;
}
