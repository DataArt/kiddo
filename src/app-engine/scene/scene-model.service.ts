import { SceneModel } from './common/models/scene-model';
import { GameStatistics, WinButton } from './common/entities';
import { Singleton } from '../singleton.decorator';

@Singleton
export class SceneModelService {
  private _sceneModel: SceneModel = { sceneType: null, checkingLogic: null };
  private _sceneInitialScript = '';
  private _taskDescription = '';
  private _winButton: WinButton = { url: null, text: null };
  private _gameStatistics: GameStatistics = { gameFinished: null, levelPassed: null };

  constructor() {
  }

  get sceneModel(): SceneModel {
    return this._sceneModel;
  }

  set sceneModel(model: SceneModel) {
    this._sceneModel = model;
  }

  get sceneInitialScript(): string {
    return this._sceneInitialScript;
  }

  set sceneInitialScript(initialScript: string) {
    this._sceneInitialScript = initialScript;
  }

  get taskDescription(): string {
    return this._taskDescription;
  }

  set taskDescription(description: string) {
    this._taskDescription = description;
  }

  get winButton(): WinButton {
    return this._winButton;
  }

  set winButton(details: WinButton) {
    this._winButton = details;
  }

  get gameStatistics(): GameStatistics {
    return this._gameStatistics;
  }

  updateStatistics(data: any): void {
    this._gameStatistics = {
      ...this._gameStatistics,
      ...data,
    };
  }

  resetStatistics(): void {
    this._gameStatistics = {
      gameFinished: false,
      levelPassed: false
    };
  }

}
