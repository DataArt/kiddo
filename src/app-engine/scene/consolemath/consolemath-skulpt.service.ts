import {Singleton} from '../../singleton.decorator';
import {ConsoleSkulptService} from '../console/console-skulpt.service';
import {ConsoleReaderService} from '../console/readers/console-reader.service';
import {ConsoleWriterService} from '../console/writers/console-writer.service';
import {SkulptService} from '../../script-runner/skulpt.service';

declare const Sk: any;

@Singleton
export class ConsoleMathSkulptService extends ConsoleSkulptService {

    constructor(
        private skulptService: SkulptService,
        reader: ConsoleReaderService,
        writer: ConsoleWriterService
    ) {
        super(reader, writer);
        skulptService.getModuleInjector().addModule('consolemath', {
          sin : (x: number) => Math.sin(x)
        });
    }

    addApiToSkulpt(): void {
        Sk.builtins.console = {
            setValue: (variable: string, value: string | number) => this.writer.setConsoleVariableValue(variable, value),
            getValue: (variable: string) => this.reader.getVariableByName(variable).value,
        };
    }
}
