import { Coords } from '../../common/entities';
import { Direction, TurnDirection } from '../../common/entities';


export interface GameObject {
  id: number;
  type: GameObjectType;
  state: GameObjectState;
  position: Coords;
  hitboxSize: number;
  isMovable: boolean;
  isPickable: boolean;
  isCompulsory?: boolean;
  direction?: Direction;
  chasing?: boolean;
  additionalState?: GameObjectAdditionalState;
  turnDirection?: TurnDirection;
}

export interface ConfigGameObject {
  position: number[];
  direction?: Direction;
  chasing?: boolean;
  state?: GameObjectState;
  color?: GameObjectAdditionalState;
}

export enum GameObjectType {
  PLAYER = 'PLAYER',
  VIRUS = 'VIRUS',
  MASK = 'MASK',
  SANITIZER = 'SANITIZER',
  PERSON = 'PERSON',
  EXIT = 'EXIT',
}

export enum GameObjectState {
  ACTIVATED = 'ACTIVATED',
  DEFAULT = 'DEFAULT',
  MOVING = 'MOVING',
  PICKED = 'PICKED',
  SUCCESS = 'SUCCESS', // TODO: should be moved to particular PlayerState enum ?
  FAIL = 'FAIL',  // TODO: should be moved to particular PlayerState enum ?
}

export enum GameObjectAdditionalState {
  WASHING_HANDS = 'WASHING_HANDS', // TODO: should be moved to particular PlayerState enum ?
  WEARING_MASK = 'WEARING_MASK', // TODO: should be moved to particular PlayerState enum ?
  CARRYING_PRODUCTS = 'CARRYING_PRODUCTS', // TODO: should be moved to particular PlayerState enum ?
  UP = 'UP',
  UP_RIGHT = 'UP_RIGHT',
  RIGHT = 'RIGHT',
  DOWN_RIGHT = 'DOWN_RIGHT',
  DOWN = 'DOWN',
  DOWN_LEFT = 'DOWN_LEFT',
  LEFT = 'LEFT',
  UP_LEFT = 'UP_LEFT',
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface PandemicGameObjectCssClassImageMap {
  [cssClass: string]: string;
}
