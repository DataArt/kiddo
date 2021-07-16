import {Singleton} from '../../singleton.decorator';
import {ConsoleSkulptService} from '../console/console-skulpt.service';
import {ConsoleReaderService} from '../console/readers/console-reader.service';
import {ConsoleWriterService} from '../console/writers/console-writer.service';
import {SkulptService} from '../../script-runner/skulpt.service';
import {SkulptModuleInjectorService} from '../../script-runner/skulpt-module-injector.service';

declare const Sk: any;

@Singleton
export class ConsoleMathSkulptService extends ConsoleSkulptService {

    constructor(
        private skulptService: SkulptService,
        reader: ConsoleReaderService,
        writer: ConsoleWriterService
    ) {
        super(reader, writer);
    }

    addApiToSkulpt(): void {
        const injector: SkulptModuleInjectorService = this.skulptService.getModuleInjector();
        injector.removeAllInjectedModules();

        injector.addModule('console', {
            set_value: (variable: string, value: string | number) => this.writer.setConsoleVariableValue(variable, value),
            get_value: (variable: string) => this.reader.getVariableByName(variable).value,
        });

        injector.addModule('consolemath', {
            sin: (x: number) => Math.sin(x),
            cos: (x: number) => Math.cos(x),
            to_array: (...args) => args,
        });
    }
}
