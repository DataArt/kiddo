import { GameObject, GameObjectType } from './game-object';

export interface Collision {
  firstObject: GameObject;
  secondObject: GameObject;
}

export const collisionMessages = {
  [GameObjectType.VIRUS]: {
      sceneName: 'WHO',
      errorMessage: 'CAUGHT_BY_VIRUS'
  },
  [GameObjectType.PERSON]: {
      sceneName: 'WHO',
      errorMessage: 'TOO_CLOSE_TO_PERSON'
  }
};
