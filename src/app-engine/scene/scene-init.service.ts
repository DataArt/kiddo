import { SceneConfig } from './common/scene-config';
import { SceneType } from './common/models/scene-type.enum';
import { RaccoonBuilderService } from './raccoon/raccoon-builder.service';
import { PandemicBuilderService } from './pandemic/pandemic-builder.service';
import { ConsoleBuilderService } from './console/console-builder.service';
import { SceneBuilder } from './common/scene-builder';
import { SceneModelService } from './scene-model.service';
import { SceneAccessorsService } from './scene-accessors.service';
import { RaccoonReaderService } from './raccoon/readers/raccoon-reader.service';
import { RaccoonWriterService } from './raccoon/writers/raccoon-writer.service';
import { RaccoonTrackerService } from './raccoon/tracker/raccoon-tracker.service';
import { RaccoonSkulptService } from './raccoon/raccoon-skulpt.service';
import { PandemicReaderService } from './pandemic/readers/pandemic-reader.service';
import { PandemicWriterService } from './pandemic/writers/pandemic-writer.service';
import { PandemicSkulptService } from './pandemic/pandemic-skulpt.service';
import { ConsoleReaderService } from './console/readers/console-reader.service';
import { ConsoleWriterService } from './console/writers/console-writer.service';
import { ConsoleSkulptService } from './console/console-skulpt.service';
import { Singleton } from '../singleton.decorator';
import { RaccoonValidationService } from './raccoon/raccoon-validation.service';
import { ConsoleValidationService } from './console/console-validation.service';
import { PandemicValidationService } from './pandemic/pandemic-validation.service';
import {ConsoleMathSkulptService} from './consolemath/consolemath-skulpt.service';
import {SkulptService} from '../script-runner/skulpt.service';

interface BuildersMap {
  [sceneType: string]: () => SceneBuilder;
}

@Singleton
export class SceneInitService {

  // ADD NEW SCENE BUILDERS HERE!
  private readonly buildersMap: BuildersMap = {
    [SceneType.RACCOON]: () => {
      const reader = new RaccoonReaderService(this.sceneModelService);
      const writer = new RaccoonWriterService(this.sceneModelService, reader);
      const tracker = new RaccoonTrackerService();
      const validation = new RaccoonValidationService();
      const api = new RaccoonSkulptService(reader, writer, tracker);
      return new RaccoonBuilderService(reader, writer, api, validation);
    },
    [SceneType.PANDEMIC]: () => {
      const reader = new PandemicReaderService(this.sceneModelService);
      const writer = new PandemicWriterService(this.sceneModelService, reader);
      const validation = new PandemicValidationService();
      const api = new PandemicSkulptService(reader, writer);
      return new PandemicBuilderService(reader, writer, api, validation);
    },
    [SceneType.CONSOLE]: () => {
      const reader = new ConsoleReaderService(this.sceneModelService);
      const writer = new ConsoleWriterService(this.sceneModelService, reader);
      const api = new ConsoleSkulptService(reader, writer);
      const validation = new ConsoleValidationService();
      return new ConsoleBuilderService(reader, writer, api, validation);
    },
    [SceneType.CONSOLEMATH]: () => {
      const reader = new ConsoleReaderService(this.sceneModelService);
      const writer = new ConsoleWriterService(this.sceneModelService, reader);
      const api = new ConsoleMathSkulptService(this.skulptService, reader, writer);
      const validation = new ConsoleValidationService();
      return new ConsoleBuilderService(reader, writer, api, validation);
    }
  };

  private sceneBuilder: SceneBuilder;

  constructor(private sceneModelService: SceneModelService,
              private sceneAccessorsService: SceneAccessorsService,
              private skulptService: SkulptService) {
  }

  init(sceneConfig: SceneConfig): void {
    // ============= Initializing a scene takes the following steps: =============

    // 1. Get the scene descriptor from a builder
    this.sceneBuilder = this.buildersMap[sceneConfig.sceneType.toUpperCase()]();
    const sceneDescriptor = this.sceneBuilder.buildScene(sceneConfig);

    // 2. Set model according to the descriptor
    this.sceneModelService.sceneModel = sceneDescriptor.model;
    this.sceneModelService.sceneInitialScript = sceneConfig.initialScript;
    this.sceneModelService.taskDescription = sceneConfig.taskDescription;
    this.sceneModelService.winButton = sceneConfig.winButton;

    // 3. Set accessors (readers/writers) according to the descriptor
    this.sceneAccessorsService.reader = sceneDescriptor.reader;
    this.sceneAccessorsService.reader.init();
    this.sceneAccessorsService.writer = sceneDescriptor.writer;
    this.sceneAccessorsService.writer.init();
    this.sceneAccessorsService.sceneSkulptService = sceneDescriptor.skulptService;
  }

}
