import { PandemicReaderService } from './readers/pandemic-reader.service';
import { PandemicWriterService } from './writers/pandemic-writer.service';
import { SceneConfig } from '../common/scene-config';
import { SceneDescriptor } from '../common/scene-descriptor';
import { Coords, Direction, CheckingLogic } from '../common/entities';
import { PandemicSceneModel } from './models/pandemic-scene-model';
import {
  Tile,
  ConfigGameObject,
  GameObjectState, GameObjectType,
  GameObjectAdditionalState,
  Virus,
  Mask,
  Sanitizer,
  Person } from './entities';
import { SceneType } from '../common/models/scene-type.enum';
import { PandemicSkulptService } from './pandemic-skulpt.service';
import { SceneBuilder } from '../common/scene-builder';
import { Singleton } from 'src/app-engine/singleton.decorator';

@Singleton
export class PandemicBuilderService implements SceneBuilder {
  sceneModel: PandemicSceneModel = {
    sceneType: SceneType.PANDEMIC,
    player: null,
    gameField: [],
    gameObjects: [],
    terraIncognita: false,
    maze: [''][''],
    customeTiles: [],
    checkingLogic: null
  };

  directions = {
    RIGHT: Direction.RIGHT,
    LEFT: Direction.LEFT,
    UP: Direction.UP,
    DOWN: Direction.DOWN
  };

  private gameObjectIdCounter: number;


  constructor(private reader: PandemicReaderService,
              private writer: PandemicWriterService,
              private sceneSkulptService: PandemicSkulptService,
  ) {
  }

  private get nextGameObjectID(): number {
    return this.gameObjectIdCounter++;
  }

  buildScene(config: SceneConfig): SceneDescriptor {
    this.resetModel();
    this.parseGeneratingFunc(config.generatingFunc);
    return { model: this.sceneModel, reader: this.reader, writer: this.writer, skulptService:  this.sceneSkulptService };
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

  private setMaskRequired(): void {
    this.sceneModel.shouldPutOnMask = true;
  }

  private setGameField(gameField: Tile[][]): void {
    if (!gameField) throw new Error('Tile scene must have a game field');
    this.sceneModel.gameField = gameField;
  }

  private addCheckingLogic(checkingLogic: string): void {
    if (!checkingLogic) return;
    this.sceneModel.checkingLogic = new Function(checkingLogic) as CheckingLogic;
  }

  parseGeneratingFunc(generatingFunc: string): PandemicSceneModel {
    new Function(generatingFunc).call(this);
    return this.sceneModel;
  }

  protected derivePosition(possiblePositions: number[] | number[][]): Coords {
    if (this.isMatrix(possiblePositions)) {
      const randomPositionNumber = Math.floor(Math.random() * possiblePositions.length);
      return { x: possiblePositions[randomPositionNumber][0], y: possiblePositions[randomPositionNumber][1] };
    } else {
      return { x: possiblePositions[0], y: possiblePositions[1] };
    }
  }

  protected isMatrix(incomingArray: number[] | number[][]): incomingArray is number[][] {
    return Array.isArray(incomingArray[0]) && Array.isArray(incomingArray[1]);
  }

  private addVirus(position: number[] | number[][], direction: string, chasing: boolean = false): void {
    if (!position?.length) return;
    const newMonster: Virus = {
      id: this.nextGameObjectID,
      type: GameObjectType.VIRUS,
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

  private addPerson(position: number[] | number[][], direction: string): void {
    if (!position?.length) return;
    const newPerson: Person = {
      id: this.nextGameObjectID,
      type: GameObjectType.PERSON,
      position: this.derivePosition(position),
      direction: Object.values(Direction).find(oneDirection => oneDirection === direction.toUpperCase()) || Direction.RIGHT,
      state: GameObjectState.DEFAULT,
      hitboxSize: 0,
      isMovable: true,
      isPickable: false,
      additionalState: Math.round(Math.random()) === 0 ? GameObjectAdditionalState.MALE : GameObjectAdditionalState.FEMALE,
    };
    this.sceneModel.gameObjects.push(newPerson);
  }


  addSanitizers(...sanitizers: number[][]): void {
    if (!sanitizers?.length) return;
    sanitizers.forEach((gameObject: number[]) => {
      const sanitizer: Sanitizer = {
        id: this.nextGameObjectID,
        type: GameObjectType.SANITIZER,
        position: { x: gameObject[0], y: gameObject[1] },
        state: GameObjectState.DEFAULT,
        hitboxSize: 0,
        isMovable: false,
        isPickable: true,
        isCompulsory: true,
      };
      this.sceneModel.gameObjects.push(sanitizer);
    });
  }

  private addMasks(...masks: number[][]): void {
    if (!masks?.length) return;
    masks.forEach((gameObject: number[]) => {
      const cookie: Mask = {
        id: this.nextGameObjectID,
        type: GameObjectType.MASK,
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

  addPeople(people: ConfigGameObject[]): void {
    if (!people) {
      return;
    }
    people.forEach((person: ConfigGameObject, index: number) => {
      this.sceneModel.gameObjects.push({
        direction: person.direction ? (this.directions[(person.direction).toUpperCase()] || Direction.RIGHT) : Direction.RIGHT,
        position: this.derivePosition(person.position),
        type: GameObjectType.PERSON,
        hitboxSize: 1,
        isMovable: true,
        isPickable: false,
        state: GameObjectState.DEFAULT,
        additionalState: Math.round(Math.random()) === 0 ? GameObjectAdditionalState.MALE : GameObjectAdditionalState.FEMALE,
        id: this.nextGameObjectID,
      });
    });
  }

  private resetModel(): void {
    this.sceneModel = {
      sceneType: SceneType.PANDEMIC,
      player: null,
      gameField: [],
      gameObjects: [],
      terraIncognita: false,
      maze: [''][''],
      customeTiles: [],
      checkingLogic: null,
      productsPicked: false,
      maskIsOn: false,
      handsWashed: false,
      shouldPutOnMask: false,
    };
  }
}
