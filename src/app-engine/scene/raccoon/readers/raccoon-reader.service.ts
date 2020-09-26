import { SceneType } from '../../common/models/scene-type.enum';
import { RaccoonSceneModel } from '../models/raccoon-scene-model';
import {
  GameObject,
  GameObjectAdditionalState,
  GameObjectState,
  GameObjectType,
  PassableTile,
  Player, Tile, CustomeTile
} from '../entities';
import {
  Coords,
  Direction,
  moveDirections,
  RaccoonGameStatistics,
} from '../../common/entities';
import { SceneModelService } from '../../scene-model.service';
import { SceneReader } from '../../common/readers/scene.reader';
import { Collision } from '../entities/collision';

export class RaccoonReaderService implements SceneReader {

  sceneModel: RaccoonSceneModel;

  constructor(private sceneModelService: SceneModelService) {
  }

  init(): void {
    this.sceneModel = this.sceneModelService.sceneModel as RaccoonSceneModel;
  }

  getPlayer(): Player {
    return this.sceneModel?.player;
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

  getDirectionNumericValue(direction: Direction): number {
    return moveDirections[direction].numericValue;
  }

  checkPlayerReachedFinish(): boolean {
    return this.checkGameObjectOnTile(this.getPlayer(), PassableTile.HOME)
      || this.checkGameObjectOnTile(this.getPlayer(), PassableTile.FINAL);
  }


  getGameStatistics(): RaccoonGameStatistics {
    const gameStatistics: RaccoonGameStatistics = {
      gameFinished: true,
      levelPassed: false,
    };

    gameStatistics.compulsoryObjectsPicked = this.getCompulsoryGameObjects().filter(item => item.state === GameObjectState.PICKED).length;
    gameStatistics.compulsoryObjectsTotalAmount = this.getCompulsoryGameObjects().length;
    gameStatistics.cellsPassed = (this.sceneModelService.gameStatistics as RaccoonGameStatistics).cellsPassed || 0;

    return gameStatistics;
  }

  getGameFailMessage(): string {
    return !this.checkAllCompulsoryGameObjectsPicked()
      ? 'NOT_ALL_COMPULSORY_OBJECTS_COLLECTED'
      : this.sceneModel?.checkingLogic();
  }

  inspect(offsets: Coords[]): number | number[] {
    this.getPlayer().state = GameObjectState.DEFAULT;
    const objectsAround = [];
    for (const offset of offsets) {
      try {
        if (Object.values(PassableTile).includes(this.sceneModel.gameField[this.sceneModel.player.position.y
        + offset.y][this.sceneModel.player.position.x + offset.x] as any)) {
          if (this.checkObjectExistsOnCell(offset, this.getGameObjectsOfType(GameObjectType.MONSTER))) {
            objectsAround.push(2);
            continue;
          }
          if (this.checkObjectExistsOnCell(offset, this.getGameObjectsOfType(GameObjectType.COOKIE))) {
            objectsAround.push(3);
            continue;
          }
          if (this.getTileOnPosition({
            x: this.sceneModel.player.position.x + offset.x,
            y: this.sceneModel.player.position.y + offset.y,
          }) === 'FI') {
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
    return this.sceneModel.gameObjects?.some(gameObject => gameObject.isMovable);
  }


  getPlayerCollisions(): GameObject[] {
    const collisions: GameObject[] = [];
    this.sceneModel?.gameObjects.forEach((item: GameObject) => {
      if (this.detectCollision(this.getPlayer(), item)) {
        collisions.push(item);
      }
    });
    return collisions;
  }

  getGameObjectsCollisions(): Collision[] {
    const collisions: Collision[] = [];
    this.sceneModel?.gameObjects
      .filter((item: GameObject) => item.isMovable)
      .forEach((firstObject: GameObject) => {
          this.sceneModel.gameObjects.forEach((secondObject: GameObject) => {
            if (firstObject !== secondObject && this.detectCollision(firstObject, secondObject)) {
              collisions.push({firstObject, secondObject});
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
    return this.sceneModel?.terraIncognita;
  }

  getGameField(): Tile[][] {
    return this.sceneModel?.gameField;
  }

  getGameObjects(): GameObject[] {
    return this.sceneModel?.gameObjects;
  }

  getSceneType(): SceneType {
    return this.sceneModel?.sceneType;
  }

  getNextStep(gameObject: GameObject): Coords {
    return {
      x: gameObject.position.x + moveDirections[gameObject.direction].x,
      y: gameObject.position.y + moveDirections[gameObject.direction].y
    };
  }

  checkWrongStep(position: Coords): boolean {
    return this.checkIfMovedOverGameFieldEdge({x: position.x, y: position.y})
      || this.checkInvalidPosition({x: position.x, y: position.y})
      || this.sceneModel.gameObjects.some((gameObject: GameObject) => gameObject.type === GameObjectType.GATES
        && gameObject.state === GameObjectState.DEFAULT
        && this.checkSamePositions(gameObject.position, position));
  }

  getCompulsoryGameObjects(): GameObject[] {
    const compulsoryObjectsFromInventory = this.sceneModel.player.inventory?.filter(gameObj => gameObj.isCompulsory) || [];
    const compulsoryObjectsFromGameField = this.sceneModel.gameObjects?.filter(gameObj => gameObj.isCompulsory) || [];

    return compulsoryObjectsFromInventory.concat(compulsoryObjectsFromGameField);
  }

  checkIfMovedOverGameFieldEdge(coordinate: Coords): boolean {
    return (coordinate.x > (this.sceneModel.gameField[0].length - 1) || coordinate.x < 0)
      || (coordinate.y > (this.sceneModel.gameField.length - 1) || coordinate.y < 0);
  }

  checkInvalidPosition(position: Coords): boolean {
    return (
      !Object.values(PassableTile).includes(this.sceneModel.gameField[position.y][position.x] as PassableTile)
      // || this.tileSceneModel.customTiles[this.tileSceneModel.gameField[position.y][position.x]]
    );
  }

  getCustomTiles(): CustomeTile[] {
    return this.sceneModel?.customeTiles;
  }

  private checkSamePositions(positionA: Coords, positionB: Coords): boolean {
    return positionA.x === positionB.x && positionA.y === positionB.y;
  }

  private checkSameDirections(gameObject: GameObject, anotherGameObject: GameObject): boolean {
    return gameObject.direction === anotherGameObject.direction;
  }

  private detectStaticCollision(
    {position: {x: x1, y: y1}, hitboxSize: hitbox1}: GameObject,
    {position: {x: x2, y: y2}, hitboxSize: hitbox2, state: state2}: GameObject): boolean {
    if (state2 === GameObjectState.DEFAULT) {
      return this.checkSamePositions({x: x1, y: y1}, {x: x2, y: y2});
    } else {
      return (
        x1 - hitbox1 <= x2 + hitbox2 &&
        x2 - hitbox2 <= x1 + hitbox1 &&
        y1 - hitbox1 <= y2 + hitbox2 &&
        y2 - hitbox2 <= y1 + hitbox1
      );
    }
  }

  private detectMovableCollision(firstObject: GameObject, secondGameObject: GameObject): boolean {
    const currentFirstObject = {...firstObject, hitboxSize: 0};
    const firstObjectWithFormerPosition = {
      ...firstObject,
      hitboxSize: 0,
      position: this.getGameObjectFormerPosition(firstObject),
    };
    const currentSecondObject = {...secondGameObject, hitboxSize: 0};
    const secondObjectWithFormerPosition = {
      ...secondGameObject,
      hitboxSize: 0,
      position: this.getGameObjectFormerPosition(secondGameObject)
    };
    return !this.checkSameDirections(currentFirstObject, currentSecondObject)
      && (this.detectStaticCollision(currentFirstObject, secondObjectWithFormerPosition)
        || this.detectStaticCollision(currentSecondObject, firstObjectWithFormerPosition));
  }

  private getGameObjectFormerPosition(gameObject: GameObject): Coords {
    if (gameObject.state === GameObjectState.MOVING) {
      return {
        x: gameObject.position.x - moveDirections[gameObject.direction].x,
        y: gameObject.position.y - moveDirections[gameObject.direction].y
      };
    } else {
      return gameObject.position;
    }
  }

  private detectCollision(firstObject: GameObject, secondGameObject: GameObject): boolean {
    return this.detectStaticCollision(firstObject, secondGameObject)
      || (
        firstObject.isMovable
        && secondGameObject.isMovable
        && firstObject.state === GameObjectState.MOVING
        && secondGameObject.state === GameObjectState.MOVING
        && this.detectMovableCollision(firstObject, secondGameObject)
      );
  }

  private checkGameObjectOnTile(gameObject: GameObject, tile: Tile): boolean {
    return this.sceneModel.gameField[gameObject.position.y][gameObject.position.x] === tile;
  }

  private checkObjectExistsOnCell(offset: Coords, objects: GameObject[] = []): boolean {
    let presence = false;
    const targetCell = {
      position: {
        x: this.getPlayer().position.x + offset.x,
        y: this.getPlayer().position.y + offset.y
      },
    };
    objects.forEach(object => {
      if (this.checkSamePositions(object.position, targetCell.position)) {
        presence = true;
      }
    });
    return presence;
  }

  private checkAllCompulsoryGameObjectsPicked(): boolean {
    return this.getCompulsoryGameObjects().every(item => item.state === GameObjectState.PICKED);
  }

  private getTileOnPosition(position: Coords): Tile {
    return this.sceneModel?.gameField[position.y][position.x];
  }

}
