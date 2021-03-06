import { ConsoleReaderService } from './readers/console-reader.service';
import { ConsoleWriterService } from './writers/console-writer.service';
import { CheckingLogic } from '../common/entities';
import { SceneBuilder } from '../common/scene-builder';
import { ConsoleSceneConfig } from './models/console-scene-config';
import { SceneDescriptor } from '../common/scene-descriptor';
import { ConsoleSceneModel } from './models/console-scene-model';
import { SceneType } from '../common/models/scene-type.enum';
import { ConsoleSkulptService } from './console-skulpt.service';
import { Singleton } from '../../singleton.decorator';
import { ConsoleValidationService } from './console-validation.service';

@Singleton
export class ConsoleBuilderService implements SceneBuilder {
  sceneModel: ConsoleSceneModel = {
    sceneType: SceneType.CONSOLE,
    consoleContent: [],
    consoleVariables: [],
    checkingLogic: null
  };

  constructor(private reader: ConsoleReaderService,
              private writer: ConsoleWriterService,
              private sceneSkulptService: ConsoleSkulptService,
              private validationService: ConsoleValidationService
  ) {
  }

  buildScene(config: ConsoleSceneConfig): SceneDescriptor {
    this.resetModel();
    this.parseGeneratingFunc(config.generatingFunc);
    this.validationService.validateConfig(this.sceneModel);

    return { model: this.sceneModel, reader: this.reader, writer: this.writer, skulptService: this.sceneSkulptService };
  }

  private parseGeneratingFunc(generatingFunc: string): ConsoleSceneModel {
    try {
      new Function(generatingFunc).call(this);
    } catch (error) {
      throw new Error(error);
    }

    return this.sceneModel;
  }

  private addCheckingLogic(checkingLogic: string): void {
    if (!checkingLogic) return;
    this.sceneModel.checkingLogic = (new Function(checkingLogic) as CheckingLogic).bind(this.reader);
  }

  private addConsoleVariable(
    name: string,
    value: number | string,
    isReadOnly: boolean
  ): void {
    const existingVariable = this.sceneModel.consoleVariables.find(variable => variable.name === name);
    if (existingVariable) {
      existingVariable.value = value;
    } else {
      this.sceneModel.consoleVariables.push({
        name,
        value,
        readOnly: isReadOnly || false,
      });
    }
  }

  private resetModel(): void {
    this.sceneModel = {
      sceneType: SceneType.CONSOLE,
      consoleContent: [],
      consoleVariables: [],
      checkingLogic: null,
    };
  }
}
