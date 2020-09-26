import { ConsoleWriterService } from './writers/console-writer.service';
import { ConsoleReaderService } from './readers/console-reader.service';
import { SceneSkulptService } from '../common/scene-skulpt-service';
import { Singleton } from '../../singleton.decorator';

declare const Sk: any;

@Singleton
export class ConsoleSkulptService implements SceneSkulptService {

  executionWasAborted = false;

  constructor(private reader: ConsoleReaderService,
              private writer: ConsoleWriterService,
  ) {
    Sk.configure({ output: this.skulptOutputFunction.bind(this) });
  }

  addApiToSkulpt(): void {
    Sk.builtins.console = {
      setValue: (variable: string, value: string | number) => this.writer.setConsoleVariableValue(variable, value),
      getValue: (variable: string) => this.reader.getVariableByName(variable).value,
    };
  }

  private skulptOutputFunction(text: string): void {
    this.writer.updateConsoleContent(text);
    console.log(text); // required for QA team
  }

}
