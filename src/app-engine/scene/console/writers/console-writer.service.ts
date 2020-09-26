import {ConsoleVariableValue } from '../../common/entities';
import { GameFailError } from 'src/app-engine/scene/common/errors';
import { ConsoleReaderService } from '../readers/console-reader.service';
import { ConsoleSceneModel } from '../models/console-scene-model';
import { SceneModelService } from '../../scene-model.service';
import { SceneWriter } from '../../common/writers/scene.writer';
import { Singleton } from '../../../singleton.decorator';

@Singleton
export class ConsoleWriterService implements SceneWriter {
  sceneModel: ConsoleSceneModel;

  constructor(
    private sceneModelService: SceneModelService,
    private consoleSceneReaderService: ConsoleReaderService,
  ) {
  }

  init(): void {
    this.sceneModel = this.sceneModelService.sceneModel as ConsoleSceneModel;
  }

  updateConsoleContent(extraContent: string): void {
    this.sceneModel.consoleContent.push(extraContent);
  }

  clearConsole(): void {
    this.sceneModel.consoleContent.length = 0;
  }

  setConsoleVariableValue(name: string, value: ConsoleVariableValue): void {
    const existingVariable = this.consoleSceneReaderService.getVariableByName(name);
    if (existingVariable) {
      if (existingVariable.readOnly) {
        this.updateConsoleContent('Variable ' + existingVariable.name + ' is readonly\n');
      } else {
        existingVariable.value = value;
      }
    } else {
      throw new GameFailError('UNKNOWN_VARIABLE');
    }
  }

}
