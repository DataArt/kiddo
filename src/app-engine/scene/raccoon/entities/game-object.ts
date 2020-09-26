import { Coords } from '../../common/entities';
import { Direction, TurnDirection } from '../../common/entities';

export interface GameObject {
  id: number;
  type: GameObjectType;
  position: Coords;
  state: GameObjectState;
  additionalState?: GameObjectAdditionalState;
  direction?: Direction;
  turnDirection?: TurnDirection;
  isMovable: boolean;
  isPickable: boolean;
  isCompulsory?: boolean;
  hitboxSize: number;
  chasing?: boolean;
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
  MONSTER = 'MONSTER',
  KEY = 'KEY',
  DOOR = 'DOOR',
  TURRET = 'TURRET',
  COOKIE = 'COOKIE',
  MINE = 'MINE',
  EXIT = 'EXIT',
  GATES = 'GATES'
}

export enum GameObjectState {
  DEFAULT = 'DEFAULT',
  MOVING = 'MOVING',
  ACTIVATED = 'ACTIVATED',
  FIRES = 'FIRES',
  OPEN = 'OPEN',
  PICKED = 'PICKED',
  SUCCESS = 'SUCCESS', // TODO: should be moved to particular PlayerState enum ?
  FAIL = 'FAIL',  // TODO: should be moved to particular PlayerState enum ?
  RECHARGE = 'RECHARGE'
}

export enum GameObjectAdditionalState {
  UP = 'UP',
  UP_RIGHT = 'UP_RIGHT',
  RIGHT = 'RIGHT',
  DOWN_RIGHT = 'DOWN_RIGHT',
  DOWN = 'DOWN',
  DOWN_LEFT = 'DOWN_LEFT',
  LEFT = 'LEFT',
  UP_LEFT = 'UP_LEFT',
  RED = 'RED',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  BLUE = 'BLUE',
}

export interface GameObjectCssClassImageMap {
  [cssClass: string]: string;
}
