import { Injectable } from '@angular/core';
import { Coords } from '../common/entities';
import { GameFailError } from '../common/errors';

@Injectable({
  providedIn: 'root'
})
export class PandemicValidationService {

  constructor() { }

  validateLook(args: any): Coords[] {
    const lookValidArgs = new Set([-3, -2, -1, 0, 1, 2, 3]);
    return this.checkLook(args, lookValidArgs);
  }

  validateGo(steps: any): void {
    if (!(typeof steps === 'number' && steps > 0 && Number.isInteger(steps))) {
      throw new GameFailError('INVALID_ARGUMENT');
    }
  }

  validateWait(steps: any): void {
    if (!(typeof steps === 'number' && steps > 0 && Number.isInteger(steps))) {
      throw new GameFailError('INVALID_ARGUMENT');
    }
    if (steps > 100) {
      throw new GameFailError('ARGUMENT_OUT_OF_RANGE');
    }
  }

  validateEmptyMethod(args: any): void {
    if (args) {
      throw new GameFailError('EXTRA_ARGUMENT');
    }
  }

  validateDisinfect(args: any): void {
    const validDisinfectArgs = new Set([0, 1, 2, 3, 4, 5, 6, 7]);
    if (!validDisinfectArgs.has(args)) {
      throw new GameFailError('INVALID_ARGUMENT');
    }
  }

  areTwoNumbers(args: any, validArgs: Set<number>): boolean {
    return (args.length === 2
      && typeof args[0].v === 'number'
      && validArgs.has(args[0].v)
      && typeof args[1].v === 'number')
      && validArgs.has(args[1].v);
  }

  private checkLook(args: any, validArgs: Set<number>): Coords[] {
    if (this.areTwoNumbers(args, validArgs)) {
      return [{ x: args[0].v, y: args[1].v }];
    } else {
      if (args.length > 0) {
        return args.map(arg => {
          if (this.areTwoNumbers(arg.v, validArgs)) {
            return { x: arg.v[0].v, y: arg.v[1].v };
          } else {
            throw new GameFailError('INVALID_ARGUMENT');
          }
        });
      } else {
        throw new GameFailError('INVALID_ARGUMENT');
      }
    }
  }

}
