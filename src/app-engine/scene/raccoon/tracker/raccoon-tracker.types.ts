/**
 * Represents a chronological sequence of all game steps taken
 */
export interface ExecutionLog {
  actions: PlayerAction[];
  victoryAchieved: boolean;
}

/**
 * Generally represents which {@link SceneWriter}'s method should be called with which *args*
 */
export interface PlayerAction {
  type: PlayerActionType;
  /**
   * optional field representing *args* to be passed to a {@link SceneWriter}'s method
   */
  payload?: any[];
}

export enum PlayerActionType {
  MOVE,
  WAIT,
  ACTIVATE_GAME_OBJECT
}
