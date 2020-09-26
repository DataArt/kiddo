import { GameObject, GameObjectType } from './game-object';

export interface Collision {
  firstObject: GameObject;
  secondObject: GameObject;
}

export const collisionMessages = {
  [GameObjectType.MONSTER]: {
      sceneName: 'RACCOON',
      errorMessage: 'CAUGHT_BY_MONSTER'
  },
  [GameObjectType.GATES]: {
    sceneName: 'RACCOON',
    errorMessage: 'NO_GATES_KEY'
  }
};
