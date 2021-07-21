import { Injectable } from '@angular/core';
import { CheckingLogic, Coords } from '../common/entities';
import { GameFailError } from '../common/errors';
import { SceneConfigError } from '../common/errors/game-fail-error';
import { PassableTile, Player, Tile } from './entities';
import { PandemicSceneModel } from './models/pandemic-scene-model';

@Injectable({
  providedIn: 'root'
})
export class PandemicValidationService {

  constructor() { }

  private prefix = 'PANDEMIC';

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
      && typeof args[0] === 'number'
      && validArgs.has(args[0])
      && typeof args[1] === 'number')
      && validArgs.has(args[1]);
  }

  private checkLook(args: any, validArgs: Set<number>): Coords[] {
    if (this.areTwoNumbers(args, validArgs)) {
      return [{ x: args[0], y: args[1] }];
    } else {
      if (args.length > 0) {
        return args.map(arg => {
          if (this.areTwoNumbers(arg, validArgs)) {
            return { x: arg[0], y: arg[1] };
          } else {
            throw new GameFailError('INVALID_ARGUMENT');
          }
        });
      } else {
        throw new GameFailError('INVALID_ARGUMENT');
      }
    }
  }

  validateConfig(config: PandemicSceneModel): void {
    const {gameField, player, gameObjects, checkingLogic} = config;

    this.validateGameField(gameField);
    this.validatePlayer(player);

    this.validatePositionOnRoad(player.position, gameField, `${this.prefix}.PLAYER_COORDS`);
    this.validatePositionOnGameField(player.position, gameField, `${this.prefix}.PLAYER_OUT_FIELD`);

    for (const obj of gameObjects) {
      this.validatePositionOnRoad(obj.position, gameField, `${this.prefix}.GAMEOBJECTS_COORDS`);
      this.validatePositionOnGameField(obj.position, gameField, `${this.prefix}.GAMEOBJECTS_OUT_FIELD`);
      this.validateSameCoordinates(obj.position, player.position);

      for (const anotherObj of gameObjects) {
        if (obj !== anotherObj) {
          this.validateSameCoordinates(obj.position, anotherObj.position);
        }
      }
    }

    this.validateCheckingLogic(checkingLogic);
  }

  private validatePositionOnRoad(position: Coords, gameField: Tile[][], message: string): void {
    if ( !Object.values(PassableTile).find(tile => tile === gameField[position.y][position.x])) {
      throw new SceneConfigError(message);
    }
  }

  private validatePositionOnGameField(position: Coords, gameField: Tile[][], message: string): void {
    if (position.x < 0
    || position.y < 0
    || position.x > (gameField[0].length - 1)
    || position.y > (gameField.length - 1)) {
      throw new SceneConfigError(message);
    }
  }

  private validateSameCoordinates(firstPosition: Coords, secondPosition: Coords): void {
    if (firstPosition.x === secondPosition.x && firstPosition.y === secondPosition.y) {
      throw new SceneConfigError(`${this.prefix}.GAMEOBJECTS_SAME_COORDS`);
    }
  }

  private validateCheckingLogic(checkingLogic: CheckingLogic): void {
    if (!checkingLogic) {
      throw new SceneConfigError(`${this.prefix}.NO_CHECKING_LOGIC`);
     }
  }

  private validateGameField(gameField: Tile[][]): void {
    if (gameField.length === 0) {
      throw new SceneConfigError(`${this.prefix}.NO_GAMEFIELD`);
    }
    for (const row of gameField) {
      if (row.length !== gameField[0].length) {
        throw new SceneConfigError(`${this.prefix}.GAMEFIELD_ROW_LENGTH`);
      }
    }
  }

  private validatePlayer(player: Player): void {
    if (player === null) {
      throw new SceneConfigError(`${this.prefix}.NO_PLAYER`);
    }
  }

}
