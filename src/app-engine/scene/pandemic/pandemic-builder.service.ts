import { Injectable } from '@angular/core';
import { PandemicReaderService } from './readers/pandemic-reader.service';
import { PandemicWriterService } from './writers/pandemic-writer.service';
import { SceneConfig } from '../common/scene-config';
import { SceneDescriptor } from '../common/scene-descriptor';
import { Coords, Direction, TileSceneWinCondition, WinButton, CheckingLogic } from '../common/entities';
import { PandemicSceneModel } from './models/pandemic-scene-model';
import { Player, Tile, ConfigGameObject, GameObjectState, GameObjectType, GameObjectAdditionalState } from './entities';
import { SceneType } from '../common/models/scene-type.enum';
import { I18nFactoryService } from '../../../app/shared/services';
import { PandemicSceneConfig } from './models/pandemic-scene-config';
import { TerminalService } from '../../../app/code-editor/terminal/terminal.service';
import { PandemicSkulptService } from './pandemic-skulpt.service';
import { SceneBuilder } from '../common/scene-builder';

@Injectable({
  providedIn: 'root'
})
export class PandemicBuilderService implements SceneBuilder {
  sceneModel: PandemicSceneModel;

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

  nextGameObjectID(): number {
    return this.gameObjectIdCounter++;
  }

  buildScene(config: SceneConfig): SceneDescriptor {
    this.parseGeneratingFunc(config.generatingFunc);
    return { model: this.sceneModel, reader: this.reader, writer: this.writer, skulptService:  this.sceneSkulptService };
  }

  addPlayer(player: Player): void {
    if (!player) throw new Error('Pandemic scene must have a player');
    this.sceneModel.player = player;
  }

  addGameField(gameField: Tile[][]): void {
    if (!gameField) throw new Error('Pandemic scene must have a game field');
    this.sceneModel.gameField = gameField;
  }

  initializeGameField(gameField: Tile[][]): void {
    if (!gameField) {
      return;
    }
    this.sceneModel.gameField = [];
    for (let i = 0; i < gameField.length; i++) {
      this.sceneModel.gameField[i] = new Array(gameField[i].length);
      for (let j = 0; j < gameField[0].length; j++) {
        this.sceneModel.gameField[i][j] = gameField[i][j];
      }
    }
  }

  addCheckingLogic(checkingLogic: CheckingLogic): void {
    if (!checkingLogic) return;
    this.sceneModel.checkingLogic = checkingLogic;
  }

  addWinButtonDetails(details: WinButton): void {
    if (!details) return;
    this.sceneModel.winButton = { ...details };
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

  async initializePandemicLevel(levelConfig: PandemicSceneConfig): Promise<void> {
    this.parseGeneratingFunc(levelConfig.generatingFunc);
    this.initializeLevel(levelConfig);
    this.sceneModel.sceneType = SceneType.PANDEMIC;
    this.sceneModel.maskIsOn = false;
    this.sceneModel.handsWashed = false;
    this.sceneModel.productsPicked = false;
    this.sceneModel.shouldPutOnMask = levelConfig.shouldPutOnMask;
    this.addPeople(levelConfig.people);
    this.addViruses(levelConfig.viruses);
    this.addSanitizers(levelConfig.sanitizers);
    this.addMasks(levelConfig.masks);
  }

  initializeLevel(levelConfig: PandemicSceneConfig): void {
    this.addPlayer(levelConfig.player);
    this.initializeGameField(levelConfig.gameField);
    this.sceneModel.gameObjects = [];
    // this.addWinCondition(levelConfig.winCondition);
    this.addWinButtonDetails(levelConfig.winButtonDetails);
    this.sceneModel.sceneInitialScript = levelConfig.initialScript;
    this.sceneModel.taskDescription = levelConfig.taskDescription;
  }

  addSanitizers(sanitizers: ConfigGameObject[]): void {
    if (!sanitizers) {
      return;
    }
    sanitizers.forEach((sanitizer: ConfigGameObject) => {
      this.sceneModel.gameObjects.push({
        position: { x: sanitizer.position[0], y: sanitizer.position[1] },
        type: GameObjectType.SANITIZER,
        hitboxSize: 0,
        isMovable: false,
        state: GameObjectState.DEFAULT,
        isPickable: true,
        id: this.nextGameObjectID(),
      });
    });
  }

  addMasks(masks: ConfigGameObject[]): void {
    if (!masks) {
      return;
    }
    masks.forEach((mask: ConfigGameObject) => {
      this.sceneModel.gameObjects.push({
        position: { x: mask.position[0], y: mask.position[1] },
        type: GameObjectType.MASK,
        hitboxSize: 0,
        isMovable: false,
        state: GameObjectState.DEFAULT,
        isPickable: true,
        id: this.nextGameObjectID(),
      });
    });
  }

  addViruses(viruses: ConfigGameObject[]): void {
    if (!viruses) {
      return;
    }
    viruses.forEach((virus: ConfigGameObject) => {
      this.sceneModel.gameObjects.push({
        direction: virus.direction ? (this.directions[(virus.direction).toUpperCase()] || Direction.RIGHT) : Direction.RIGHT,
        position: this.derivePosition(virus.position),
        type: GameObjectType.VIRUS,
        hitboxSize: 0,
        isMovable: true,
        isPickable: false,
        chasing: virus.chasing === true,
        state: GameObjectState.DEFAULT,
        id: this.nextGameObjectID(),
      });
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
        id: this.nextGameObjectID(),
      });
    });
  }
}
