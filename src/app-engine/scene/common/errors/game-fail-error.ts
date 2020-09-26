export class GameFailError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'GameFailError';
    }
  }

export class SceneConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SceneConfigError';
  }
}
