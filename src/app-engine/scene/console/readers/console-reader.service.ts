import {
  ConsoleVariable,
  GameStatistics,
  CheckingLogic,
  ConsoleVariableValue,
} from '../../common/entities';
import { SceneReader } from '../../common/readers/scene.reader';
import { ConsoleSceneModel } from '../models/console-scene-model';
import { SceneModelService } from '../../scene-model.service';
import { Singleton } from '../../../singleton.decorator';
import { SceneType } from '../../common/models/scene-type.enum';

@Singleton
export class ConsoleReaderService implements SceneReader {
  sceneModel: ConsoleSceneModel;

  constructor(private sceneModelService: SceneModelService) {
  }

  init(): void {
    this.sceneModel = this.sceneModelService.sceneModel as ConsoleSceneModel;
  }

  getSceneType(): SceneType {
    return this.sceneModel?.sceneType;
  }

  getGameStatistics(): GameStatistics {
    const gameStatistics: GameStatistics = { gameFinished: true, levelPassed: false };
    return gameStatistics;
  }

  getGameFailMessage(): string {
    return this.sceneModel?.checkingLogic();
  }

  get consoleContent(): string[] {
    return this.sceneModel.consoleContent;
  }

  getVariableByName(name: string): ConsoleVariable {
    return this.sceneModel?.consoleVariables.find(item => item.name === name);
  }

  getVariableValue(name: string): ConsoleVariableValue {
    return this.getVariableByName(name)?.value;
  }

  getVariablesList(): ConsoleVariable[] {
    return this.sceneModel.consoleVariables;
  }

  getCheckingLogic(): CheckingLogic {
    return this.sceneModel.checkingLogic as CheckingLogic;
  }

  sceneIsPlaybackable(): boolean {
    return false;
  }
}
