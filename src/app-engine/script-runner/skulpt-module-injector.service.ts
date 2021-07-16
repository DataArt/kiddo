import {Injectable} from '@angular/core';

declare const Sk: any;

@Injectable({
    providedIn: 'root'
})
export class SkulptModuleInjectorService {
    constructor() {
    }

    addModule(name: string, module: any): void {
        Sk.builtins[name] = module;
        Sk.buildModuleFromJs = (moduleName: string) => {
            const jsModule: any = Sk.builtins[moduleName];
            const mod = {};

            const addFunction = (functionName: string) => {
                const func = (...args) => {
                    return jsModule[functionName](...args);
                };
                mod[functionName] = new Sk.builtin.func((...args) => {
                    return Sk.ffi.remapToPy(
                        func(...args.map(c => Sk.ffi.remapToJs(c)))
                    );
                });
            };

            for (const functionName in jsModule) {
                if (jsModule.hasOwnProperty(functionName)) {
                    addFunction(functionName);
                }
            }

            return mod;
        };
        Sk.builtinFiles.files[`src/lib/${name}/__init__.js`] = `
            const $builtinmodule = function(name) {
                return Sk.buildModuleFromJs(\"${name}\");
            };
        `;
    }
}
