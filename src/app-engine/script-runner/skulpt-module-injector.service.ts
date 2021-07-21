import {Injectable} from '@angular/core';

declare const Sk: any;

@Injectable({
    providedIn: 'root'
})
export class SkulptModuleInjectorService {
    private addedModules: Set<string> = new Set<string>();

    constructor() {
    }

    private static getModulePathByName(name: string): string {
        return `src/lib/${name}/__init__.js`;
    }

    addModule(name: string, module: any): void {
        this.addedModules.add(name);

        Sk.builtins[name] = module;
        Sk.buildModuleFromJs = (moduleName: string) => {
            const jsModule: any = Sk.builtins[moduleName];
            const pyModule = {};

            const addFunction = (functionName: string) => {
                const func = (...args) => {
                    return jsModule[functionName](...args);
                };
                pyModule[functionName] = new Sk.builtin.func((...args) => {
                    const result = func(...args.map(c => Sk.ffi.remapToJs(c)));
                    return Sk.ffi.remapToPy(
                        result instanceof Promise ? Sk.misceval.promiseToSuspension(result) : result
                    );
                });
            };

            for (const functionName in jsModule) {
                if (jsModule.hasOwnProperty(functionName)) {
                    addFunction(functionName);
                }
            }

            return pyModule;
        };

        Sk.builtinFiles.files[SkulptModuleInjectorService.getModulePathByName(name)] = `
            const $builtinmodule = function(name) {
                return Sk.buildModuleFromJs(\"${name}\");
            };
        `;
    }

    removeModule(name: string): void {
        this.addedModules.delete(name);
        delete Sk.builtinFiles.files[SkulptModuleInjectorService.getModulePathByName(name)];
        delete Sk.builtins[name];
    }

    removeAllInjectedModules(): void {
        const addedModulesCopy = new Set<string>(this.addedModules);
        addedModulesCopy.forEach(name => this.removeModule(name));
    }
}
