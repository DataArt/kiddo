import { RaccoonReaderService } from './readers/raccoon-reader.service';
import { RaccoonWriterService } from './writers/raccoon-writer.service';
import { RaccoonSceneModel } from './models/raccoon-scene-model';
import { Coords, Direction, CheckingLogic } from '../common/entities';
import {
  Cookie,
  GameObjectAdditionalState,
  GameObjectState,
  GameObjectType,
  Gate,
  Key,
  Mine,
  Monster,
  Tile,
  Turret
} from './entities';
import { SceneType } from '../common/models/scene-type.enum';
import { SceneDescriptor } from '../common/scene-descriptor';
import { RaccoonSceneConfig } from './models/raccoon-scene-config';
import { RaccoonSkulptService } from './raccoon-skulpt.service';
import { SceneBuilder } from '../common/scene-builder';
import { Singleton } from '../../singleton.decorator';
import { RaccoonValidationService } from './raccoon-validation.service';


@Singleton
export class RaccoonBuilderService implements SceneBuilder {
  sceneModel: RaccoonSceneModel = {
    sceneType: SceneType.RACCOON,
    player: null,
    gameField: [],
    gameObjects: [],
    terraIncognita: false,
    maze: [''][''],
    customeTiles: [],
    checkingLogic: null
  };

  colors = {
    YELLOW: GameObjectAdditionalState.YELLOW,
    RED: GameObjectAdditionalState.RED,
    BLUE: GameObjectAdditionalState.BLUE,
    GREEN: GameObjectAdditionalState.GREEN
  };

  private gameObjectIdCounter = 1;

  constructor(private reader: RaccoonReaderService,
              private writer: RaccoonWriterService,
              private sceneSkulptService: RaccoonSkulptService,
              private validationService: RaccoonValidationService
              // private mazeService: MazeService,
              ) {
  }

  private get nextGameObjectID(): number {
    return this.gameObjectIdCounter++;
  }

  buildScene(config: RaccoonSceneConfig): SceneDescriptor {
    this.resetModel();
    this.parseGeneratingFunc(config.generatingFunc);

    this.validationService.validateConfig(this.sceneModel);
    return { model: this.sceneModel, reader: this.reader, writer: this.writer, skulptService: this.sceneSkulptService };
  }

  private setPlayerPosition(x: number, y: number): void {
    if (x === undefined || y === undefined) throw new Error('Raccoon scene must have a player');
    this.sceneModel.player = {
      id: 0,
      type: GameObjectType.PLAYER,
      position: this.derivePosition([x, y]),
      hitboxSize: 0,
      state: GameObjectState.DEFAULT,
      additionalState: null,
      direction: Direction.RIGHT,
      inventory: [],
      isMovable: true,
      isPickable: false,
    };
  }

  private setGameField(gameField: Tile[][]): void {
    if (!gameField) throw new Error('Tile scene must have a game field');
    this.sceneModel.gameField = gameField;
  }

  private addCheckingLogic(checkingLogic: string | CheckingLogic): void {
    if (!checkingLogic) return;
    if (typeof checkingLogic === 'string') {
      this.sceneModel.checkingLogic = (new Function(checkingLogic as string) as CheckingLogic);
    } else {
      this.sceneModel.checkingLogic = (checkingLogic as CheckingLogic);
    }
  }

  private parseGeneratingFunc(generatingFunc: string): RaccoonSceneModel {
    try {
      new Function(generatingFunc).call(this);
    } catch (error) {
      throw new Error(error);
    }

    return this.sceneModel;
  }

  private addCookies(...cookies: number[][]): void {
    if (!cookies?.length) return;
    cookies.forEach((gameObject: number[]) => {
      const cookie: Cookie = {
        id: this.nextGameObjectID,
        type: GameObjectType.COOKIE,
        position: { x: gameObject[0], y: gameObject[1] },
        state: GameObjectState.DEFAULT,
        hitboxSize: 0,
        isMovable: false,
        isPickable: true,
        isCompulsory: true,
      };
      this.sceneModel.gameObjects.push(cookie);
    });
  }

  private addMines(...mines: number[][]): void {
    if (!mines?.length) return;
    mines.forEach((mine: number[]) => {
      const newMine: Mine = {
        id: this.nextGameObjectID,
        type: GameObjectType.MINE,
        position: { x: mine[0], y: mine[1] },
        state: GameObjectState.DEFAULT,
        hitboxSize: 0,
        isMovable: false,
        isPickable: true,
      };
      this.sceneModel.gameObjects.push(newMine);
    });
  }

  private addTurrets(...turrets: number[][]): void {
    if (!turrets?.length) return;
    turrets.forEach((turret: number[]) => {
      const newTurret: Turret = {
        id: this.nextGameObjectID,
        type: GameObjectType.TURRET,
        position: { x: turret[0], y: turret[1] },
        state: GameObjectState.DEFAULT,
        hitboxSize: 1,
        isMovable: false,
        isPickable: true,
      };
      this.sceneModel.gameObjects.push(newTurret);
    });
  }

  private addGate(position: number[], color: GameObjectAdditionalState): void {
    if (!position?.length) return;
    const newGate: Gate = {
      id: this.nextGameObjectID,
      type: GameObjectType.GATES,
      position: { x: position[0], y: position[1] },
      state: GameObjectState.DEFAULT,
      additionalState: color,
      hitboxSize: 0,
      isMovable: false,
      isPickable: false,
    };
    this.sceneModel.gameObjects.push(newGate);
  }

  private addKey(position: number[], color: GameObjectAdditionalState): void {
    if (!position?.length) return;
    const newKey: Key = {
      id: this.nextGameObjectID,
      type: GameObjectType.KEY,
      position: { x: position[0], y: position[1] },
      state: GameObjectState.DEFAULT,
      additionalState: color,
      hitboxSize: 0,
      isMovable: false,
      isPickable: true,
    };
    this.sceneModel.gameObjects.push(newKey);
  }

  private addMonster(position: number[] | number[][], direction: string, chasing: boolean = false): void {
    if (!position?.length) return;
    const newMonster: Monster = {
      id: this.nextGameObjectID,
      type: GameObjectType.MONSTER,
      position: this.derivePosition(position),
      direction: Object.values(Direction).find(oneDirection => oneDirection === direction.toUpperCase()) || Direction.RIGHT,
      state: GameObjectState.DEFAULT,
      hitboxSize: 0,
      isMovable: true,
      isPickable: false,
      chasing,
    };
    this.sceneModel.gameObjects.push(newMonster);
  }

  private addCustomTile(name: string, url: string): void {
    if (!this.sceneModel.customeTiles) {
      this.sceneModel.customeTiles = [];
    }
    this.sceneModel.customeTiles.push({ name, url });
  }

  private derivePosition(possiblePositions: number[] | number[][]): Coords {
    if (this.isMatrix(possiblePositions)) {
      const randomPositionNumber = Math.floor(Math.random() * possiblePositions.length);
      return { x: possiblePositions[randomPositionNumber][0], y: possiblePositions[randomPositionNumber][1] };
    } else {
      return { x: possiblePositions[0], y: possiblePositions[1] };
    }
  }

  private isMatrix(incomingArray: number[] | number[][]): incomingArray is number[][] {
    return Array.isArray(incomingArray[0]) && Array.isArray(incomingArray[1]);
  }

  private resetModel(): void {
    this.sceneModel = {
      sceneType: SceneType.RACCOON,
      player: null,
      gameField: [],
      gameObjects: [],
      terraIncognita: false,
      maze: [''][''],
      customeTiles: [],
      checkingLogic: null
    };
  }
}
