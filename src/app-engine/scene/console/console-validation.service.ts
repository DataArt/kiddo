import { Injectable } from '@angular/core';
import { CheckingLogic } from '../common/entities';
import { SceneConfigError } from '../common/errors/game-fail-error';
import { ConsoleSceneModel } from './models/console-scene-model';

@Injectable({
  providedIn: 'root'
})
export class ConsoleValidationService {

  constructor() {
  }

  private prefix = 'CONSOLE';

  validateConfig(config: ConsoleSceneModel): void {
    const {consoleVariables, checkingLogic} = config;

    for (const variable of consoleVariables) {
      if (typeof variable.value === 'number') {
        this.validateNumericVariableRange(variable.value);
      }
    }

    this.validateVariablesCount(consoleVariables.length);
    this.validateCheckingLogic(checkingLogic);
  }

  private validateNumericVariableRange(value: number): void {
    if (value <= -1000000 || value >= 1000000) {
      throw new SceneConfigError(`${this.prefix}.OUT_OF_RANGE`);
    }
  }

  private validateVariablesCount(variablesLength: number): void {
    if (variablesLength > 4) {
      throw new SceneConfigError(`${this.prefix}.MAX_VARIABLES`);
    }
  }

  private validateCheckingLogic(checkingLogic: CheckingLogic): void {
    if (!checkingLogic) {
      throw new SceneConfigError(`${this.prefix}.NO_CHECKING_LOGIC`);
     }
  }
}
