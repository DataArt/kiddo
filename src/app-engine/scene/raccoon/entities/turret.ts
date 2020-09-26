import { GameObject, GameObjectState, GameObjectType } from './game-object';
import { Coords } from '../../common/entities';


export interface Turret extends GameObject {
  type: GameObjectType.TURRET;
  state: GameObjectState.DEFAULT;
  position: Coords;
  hitboxSize: 1;
  isMovable: false;
  isPickable: true;
  id: number;
}
