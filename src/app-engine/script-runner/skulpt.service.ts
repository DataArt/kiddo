import { Injectable } from '@angular/core';

declare const Sk: any;

@Injectable({
  providedIn: 'root'
})
export class SkulptService {

  constructor() {
  }

  configureSkulpt(): void {
    Sk.configure({ read: this.readBuiltIn });
  }

  executeSkulpt(script: string): Promise<any> {
    return Sk.misceval.asyncToPromise(() => Sk.importMainWithBody('User script', false, script, true));
  }

  private readBuiltIn(lib: any): void {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles.files[lib] === undefined) {
      throw new Error(`File not found: ${lib}`);
    }
    return Sk.builtinFiles.files[lib];
  }

}
