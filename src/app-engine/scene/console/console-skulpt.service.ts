import { ConsoleWriterService } from './writers/console-writer.service';
import { ConsoleReaderService } from './readers/console-reader.service';
import { SceneSkulptService } from '../common/scene-skulpt-service';
import { Singleton } from '../../singleton.decorator';
import {SkulptService} from '../../script-runner/skulpt.service';
import {SkulptModuleInjectorService} from '../../script-runner/skulpt-module-injector.service';

declare const Sk: any;

@Singleton
export class ConsoleSkulptService implements SceneSkulptService {

  executionWasAborted = false;

  constructor(
        protected skulptService: SkulptService,
        protected reader: ConsoleReaderService,
        protected writer: ConsoleWriterService,
  ) {
    Sk.configure({ output: this.skulptOutputFunction.bind(this) });
  }

  addApiToSkulpt(): void {
    const injector: SkulptModuleInjectorService = this.skulptService.getModuleInjector();
    injector.removeAllInjectedModules();

    injector.addModule('console', {
      set_value: (variable: string, value: string | number) => this.writer.setConsoleVariableValue(variable, value),
      get_value: (variable: string) => this.reader.getConsoleVariableValue(variable),
    });
  }

  private skulptOutputFunction(text: string): void {
    this.writer.updateConsoleContent(text);
    console.log(text); // required for QA team
  }

}
