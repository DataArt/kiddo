import { PandemicSceneModel } from '../models/pandemic-scene-model';
import { CustomeTile, GameObject, GameObjectAdditionalState, GameObjectState, GameObjectType, Player, Tile } from '../entities';
import {
  Coords,
  Direction,
  moveDirections, PandemicGameStatistics,
  CheckingLogic
} from '../../common/entities';
import { ImpassableTile, PassableTile } from '../entities';
import { SceneModelService } from '../../scene-model.service';
import { SceneType } from '../../common/models/scene-type.enum';
import { SceneReader } from '../../common/readers/scene.reader';
import { Collision } from '../entities/collision';

export class PandemicReaderService implements SceneReader {
  sceneModel: PandemicSceneModel;

  constructor(private sceneModelService: SceneModelService) {
  }

  init(): void {
    this.sceneModel = this.sceneModelService.sceneModel as PandemicSceneModel;
  }

  getFailMessagsMap(): Array<{checkFunction: () => {}, message: string}> {
    return  [
      {
        checkFunction: () => !this.checkProductsPicked(),
        message: 'PRODUCTS_NOT_PICKED',
      },
      {
        checkFunction: () => !this.checkAllCompulsoryGameObjectsPicked(),
        message: 'NOT_ALL_COMPULSORY_OBJECTS_COLLECTED',
      }
    ];
  }

  getGameStatistics(): PandemicGameStatistics {
    // perhaps should be stored as a class private property
    const gameStatistics: PandemicGameStatistics = { gameFinished: true, levelPassed: false };
    gameStatistics.compulsoryObjectsPicked = this.getCompulsoryGameObjects().filter(item => item.state === GameObjectState.PICKED).length;
    gameStatistics.compulsoryObjectsTotalAmount = this.getCompulsoryGameObjects().length;
    gameStatistics.handsWashed = this.checkHandsWashed();
    if (this.sceneModel.shouldPutOnMask) {
      gameStatistics.maskIsOn = this.checkMaskOn();
    }
    if (this.checkShopExists()) {
      gameStatistics.productsPicked = this.checkProductsPicked();
    }
    gameStatistics.cellsPassed = (this.sceneModelService.gameStatistics as PandemicGameStatistics).cellsPassed || 0;

    return gameStatistics;
  }

  getGameFailMessage(): string {
    const message = this.getFailMessagsMap().find(x => x.checkFunction())?.message;

    return message
      ? message
      : this.sceneModel?.checkingLogic();
  }

  getPlayer(): Player {
    return this.sceneModel?.player;
  }

  getCustomTiles(): CustomeTile[] {
    return this.sceneModel?.customeTiles;
  }

  getGameObjectsOfType(type: GameObjectType, state?: GameObjectState, additionalState?: GameObjectAdditionalState): GameObject[] {
    return this.sceneModel.gameObjects.filter((gameObject: GameObject) =>
      gameObject.type === type
      && (state ? gameObject.state === state : true)
      && (additionalState ? gameObject.additionalState === additionalState : true)
    );
  }

  getInventoryObjectsOfType(type: GameObjectType): GameObject[] {
    return this.sceneModel.player.inventory.filter(gameObject => gameObject.type === type);
  }

  getPickableGameObjects(): GameObject[] {
    return this.sceneModel.gameObjects.filter((item: GameObject) => item.isPickable);
  }

  checkSamePositions(positionA: Coords, positionB: Coords): boolean {
    return positionA.x === positionB.x && positionA.y === positionB.y;
  }

  detectStaticCollision(
    { position: { x: x1, y: y1 }, hitboxSize: hitbox1 }: GameObject,
    { position: { x: x2, y: y2 }, hitboxSize: hitbox2, state: state2 }: GameObject): boolean {
    if (state2 === GameObjectState.DEFAULT) {
      return this.checkSamePositions({ x: x1, y: y1 }, { x: x2, y: y2 });
    } else {
      return (
        x1 - hitbox1 <= x2 + hitbox2 &&
        x2 - hitbox2 <= x1 + hitbox1 &&
        y1 - hitbox1 <= y2 + hitbox2 &&
        y2 - hitbox2 <= y1 + hitbox1
      );
    }
  }

  detectMovableCollision(firstObject: GameObject, secondGameObject: GameObject): boolean {
    const currentFirstObject = { ...firstObject, hitboxSize: 0 };
    const firstObjectWithFormerPosition = {
      ...firstObject,
      hitboxSize: 0,
      position: this.getGameObjectFormerPosition(firstObject),
    };
    const currentSecondObject = { ...secondGameObject, hitboxSize: 0 };
    const secondObjectWithFormerPosition = {
      ...secondGameObject,
      hitboxSize: 0,
      position: this.getGameObjectFormerPosition(secondGameObject)
    };
    return !this.checkSameDirections(currentFirstObject, currentSecondObject)
      && (this.detectStaticCollision(currentFirstObject, secondObjectWithFormerPosition)
        || this.detectStaticCollision(currentSecondObject, firstObjectWithFormerPosition));
  }

  detectCollision(firstObject: GameObject, secondGameObject: GameObject): boolean {
    return this.detectStaticCollision(firstObject, secondGameObject)
      || (
        firstObject.isMovable
        && secondGameObject.isMovable
        && firstObject.state === GameObjectState.MOVING
        && secondGameObject.state === GameObjectState.MOVING
        && this.detectMovableCollision(firstObject, secondGameObject)
      );
  }

  checkInvalidPosition(position: Coords): boolean {
    return (
      !Object.values(PassableTile).includes(this.sceneModel.gameField[position.y][position.x] as PassableTile)
      // || this.tileSceneModel.customTiles[this.tileSceneModel.gameField[position.y][position.x]]
    );
  }

  checkIfMovedOverGameFieldEdge(coordinate: Coords): boolean {
    return (coordinate.x > (this.sceneModel.gameField[0].length - 1) || coordinate.x < 0)
      || (coordinate.y > (this.sceneModel.gameField.length - 1) || coordinate.y < 0);
  }

  getGameField(): Tile[][] {
    return this.sceneModel.gameField;
  }

  getGameObjects(): GameObject[] {
    return this.sceneModel.gameObjects;
  }

  getSceneType(): SceneType {
    return this.sceneModel.sceneType;
  }

  getNextStep(gameObject: GameObject): Coords {
    return {
      x: gameObject.position.x + moveDirections[gameObject.direction].x,
      y: gameObject.position.y + moveDirections[gameObject.direction].y
    };
  }

  checkWrongStep(position: Coords): boolean {
    return this.checkIfMovedOverGameFieldEdge({ x: position.x, y: position.y })
      || this.checkInvalidPosition({ x: position.x, y: position.y });
  }

  checkGameObjectOnTile(gameObject: GameObject, tile: Tile): boolean {
    return this.sceneModel.gameField[gameObject.position.y][gameObject.position.x] === tile;
  }

  checkObjectExistsOnCell(offset: Coords, objects: GameObject[] = []): boolean {
    let presence = false;
    const targetCell = {
      position: {
        x: this.sceneModel.player.position.x + offset.x,
        y: this.sceneModel.player.position.y + offset.y
      },
    };
    objects.forEach(object => {
      if (this.checkSamePositions(object.position, targetCell.position)) {
        presence = true;
      }
    });
    return presence;
  }

  getCompulsoryGameObjects(): GameObject[] {
    const compulsoryObjectsFromInventory = this.sceneModel.player.inventory?.filter(gameObj => gameObj.isCompulsory) || [];
    const compulsoryObjectsFromGameField = this.sceneModel.gameObjects?.filter(gameObj => gameObj.isCompulsory) || [];

    return compulsoryObjectsFromInventory.concat(compulsoryObjectsFromGameField);
  }

  checkAllCompulsoryGameObjectsPicked(): boolean {
    return this.getCompulsoryGameObjects().every(item => item.state === GameObjectState.PICKED);
  }

  getPlayerCollisions(): GameObject[] {
    const collisions: GameObject[] = [];
    this.sceneModel?.gameObjects.forEach((item: GameObject) => {
      if (this.detectCollision(this.sceneModel.player, item)) {
        collisions.push(item);
      }
    });

    return collisions;
  }

  getGameObjectsCollisions(): Collision[] {
    const collisions: Collision[] = [];
    this.sceneModel.gameObjects
    .filter((item: GameObject) => item.isMovable)
    .forEach((firstObject: GameObject) => {
        this.sceneModel.gameObjects.forEach((secondObject: GameObject) => {
          if (firstObject !== secondObject && this.detectCollision(firstObject, secondObject)) {
            collisions.push({ firstObject, secondObject });
          }
        });
      }
    );
    return collisions;
  }

  getCoordinatesAround(obj: Coords): Coords[] {
    return Object.keys(moveDirections)
    .map((moveDirection: Direction) => ({
      x: moveDirections[moveDirection].x + obj.x,
      y: moveDirections[moveDirection].y + obj.y
    }));
  }

  terraIncognitaIsOn(): boolean {
    return this.sceneModel.terraIncognita;
  }

  getCheckingLogic(): CheckingLogic {
    return this.sceneModel.checkingLogic as CheckingLogic;
  }

  getGameObjectFormerPosition(gameObject: GameObject): Coords {
    if (gameObject.state === GameObjectState.MOVING) {
      return {
        x: gameObject.position.x - moveDirections[gameObject.direction].x,
        y: gameObject.position.y - moveDirections[gameObject.direction].y
      };
    } else {
      return gameObject.position;
    }
  }

  checkSameDirections(gameObject: GameObject, anotherGameObject: GameObject): boolean {
    return gameObject.direction === anotherGameObject.direction;
  }

  getTileOnPosition(position: Coords): string {
    return this.getGameField()[position.y][position.x];
  }

  getDirectionNumericValue(direction: Direction): number {
    return moveDirections[direction].numericValue;
  }

  checkPlayerReachedFinish(): boolean {
    return this.checkGameObjectOnTile(this.sceneModel.player, PassableTile.HOME)
      || this.checkGameObjectOnTile(this.sceneModel.player, PassableTile.FINAL);
  }


  checkMaskOn(): boolean {
    return !this.sceneModel.shouldPutOnMask || this.sceneModel.maskIsOn;
  }

  checkHandsWashed(): boolean {
    return this.sceneModel.handsWashed;
  }

  checkProductsPicked(): boolean {
    return !this.checkShopExists() || this.sceneModel.productsPicked;
  }

  checkEnteredMall(): boolean {
    const { MALL_DOWN_LEFT, MALL_DOWN_RIGHT, MALL_UP_LEFT, MALL_UP_RIGHT } = ImpassableTile;
    return (
      this.checkGameObjectOnTile(this.sceneModel.player, MALL_UP_LEFT)
      || this.checkGameObjectOnTile(this.sceneModel.player, MALL_UP_RIGHT)
      || this.checkGameObjectOnTile(this.sceneModel.player, MALL_DOWN_LEFT)
      || this.checkGameObjectOnTile(this.sceneModel.player, MALL_DOWN_RIGHT)
    );
  }

  checkShopExists(): boolean {
    for (const gameFieldRow of this.sceneModel.gameField) {
      if (gameFieldRow.includes(PassableTile.SHOP)) return true;
    }
    return false;
  }

  look(offsets: Coords[]): number | number[] {
    this.sceneModel.player.state = GameObjectState.DEFAULT;
    const objectsAround = [];
    for (const offset of offsets) {
      try {
        if (Object.values(PassableTile).includes(this.sceneModel.gameField[this.sceneModel.player.position.y
        + offset.y][this.sceneModel.player.position.x + offset.x] as PassableTile)) {
          if (this.checkObjectExistsOnCell(offset, this.getGameObjectsOfType(GameObjectType.VIRUS))) {
            objectsAround.push(2);
            continue;
          }
          if (this.checkObjectExistsOnCell(offset, this.getGameObjectsOfType(GameObjectType.PERSON))) {
            objectsAround.push(3);
            continue;
          }
          if (this.checkObjectExistsOnCell(offset, this.getPickableGameObjects())) {
            objectsAround.push(4);
            continue;
          }
          objectsAround.push(1);
        } else {
          objectsAround.push(0);
        }
      } catch (err) {
        objectsAround.push(0);
      }
    }
    return objectsAround.length === 1 ? objectsAround[0] : objectsAround;
  }

  sceneIsPlaybackable(): boolean {
    return this.sceneModel.gameObjects.some(gameObject => gameObject.isMovable);
  }
}
