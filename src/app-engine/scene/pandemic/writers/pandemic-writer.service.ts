import { Injectable } from '@angular/core';
import { GameFailError } from '../../common/errors';
import { PandemicSceneModel } from '../models/pandemic-scene-model';
import { Direction, moveDirections, TurnDirection } from '../../common/entities';
import {
  GameObject,
  GameObjectAdditionalState,
  GameObjectState,
  GameObjectType,
  ImpassableTile,
  PassableTile
} from '../entities';
import { TileGameStatistics } from '../../common/entities';
import { timer } from 'rxjs';
import { SceneModelService } from '../../scene-model.service';
import { PandemicReaderService } from '../readers/pandemic-reader.service';
import { Collision, collisionMessages } from '../entities/collision';
import { SceneWriter } from '../../common/writers/scene.writer';

@Injectable({
  providedIn: 'root'
})
export class PandemicWriterService implements SceneWriter {
  sceneModel: PandemicSceneModel;

  constructor(
    private sceneModelService: SceneModelService,
    private reader: PandemicReaderService,
  ) {
  }

  init(): void {
    this.sceneModel = this.sceneModelService.sceneModel as PandemicSceneModel;
  }

  // ---------------------------------------------- PLAYER METHODS ----------------------------------------------
  setDirection(direction: Direction): void {
    this.sceneModel.player.direction = direction;
  }

  setPlayerPosition(x: number, y: number): void {
    this.sceneModel.player.position = { x, y };
  }

  movePlayer(direction: Direction): void {
    if (this.sceneModel.shouldPutOnMask && !this.sceneModel.maskIsOn === true) {
      this.handleGameFail('MASK_IS_NOT_ON');
    }
    this.setDirection(direction);
    if (this.reader.checkIfMovedOverGameFieldEdge(this.reader.getNextStep(this.sceneModel.player))) {
      this.handleGameFail('OFF_MAP');
    }
    move(this.sceneModel.player);
    this.sceneModel.player.state = GameObjectState.MOVING;
    if (this.reader.checkInvalidPosition(this.sceneModel.player.position)) {
      this.handleGameFail('OFF_ROAD');
    }
    this.sceneModelService.updateStatistics({
      cellsPassed: ((this.sceneModelService.gameStatistics as TileGameStatistics).cellsPassed || 0) + 1
    });
  }

  playerWait(): void {
    this.sceneModel.player.state = GameObjectState.DEFAULT;
  }

  handleGameFail(failMessage: string): void {
    this.setPlayerState(GameObjectState.FAIL);
    this.setPlayerAdditionalState(null);
    if (failMessage === 'OFF_ROAD') {
      const mallTiles: string[] = [
        ImpassableTile.MALL_DOWN_LEFT,
        ImpassableTile.MALL_DOWN_RIGHT,
        ImpassableTile.MALL_UP_LEFT,
        ImpassableTile.MALL_UP_RIGHT
      ];
      if (mallTiles.includes(this.reader.getTileOnPosition(this.sceneModel.player.position))) {
        throw new GameFailError('ENTERED_MALL');
      }
    }
    throw new GameFailError(failMessage);
  }

  setPlayerState(newState: GameObjectState): void {
    this.sceneModel.player.state = newState;
  }

  setPlayerAdditionalState(newState: GameObjectAdditionalState): void {
    this.sceneModel.player.additionalState = newState;
  }

  private pickGameObject(gameObject: GameObject): void {
    this.sceneModel.gameObjects.splice(this.sceneModel.gameObjects.indexOf(gameObject), 1);
    gameObject.state = GameObjectState.PICKED;
    this.sceneModel.player.inventory.push(gameObject);
    console.log(this.sceneModel.player.inventory);
  }

  activateGameObject(gameObjectType: GameObjectType): void {
    let itemToActivate: GameObject = this.sceneModel.player.inventory.find((item: GameObject) => item.type === gameObjectType);
    if (itemToActivate) {
      this.reader.getPlayer().state = GameObjectState.DEFAULT;
      itemToActivate = {
        ...itemToActivate,
        state: GameObjectState.ACTIVATED,
        position: {
          x: this.sceneModel.player.position.x,
          y: this.sceneModel.player.position.y
        }
      };
      this.sceneModel.gameObjects.push(itemToActivate);
      this.sceneModel.player.inventory = this.sceneModel.player.inventory.filter((item: GameObject) => item.id !== itemToActivate.id);
    } else {
      throw new GameFailError(`INVENTORY_NO_${gameObjectType}`);
    }
  }

  detectAndHandlePlayerCollisions(): void {
    const playerCollisions: GameObject[] = this.reader.getPlayerCollisions();
    if (playerCollisions.length) {
      this.handlePlayerCollisions(playerCollisions);
    }
  }

  handlePlayerCollisions(collisions: GameObject[]): void {
    collisions.forEach((item: GameObject) => {
      if (item.isPickable && item.state === GameObjectState.DEFAULT) {
        this.pickGameObject(item);
      }
      if (item.isMovable) {
        this.handleGameFail(getErrorMessage(item.type));
      }
    });
  }

  putOnMask(): void {
    this.sceneModel.maskIsOn = true;
    this.sceneModel.player.additionalState = GameObjectAdditionalState.WEARING_MASK;
  }

  washHands(): void {
    if (this.reader.checkGameObjectOnTile(this.sceneModel.player, PassableTile.HOME)) {
      this.sceneModel.player.state = GameObjectState.DEFAULT;
      this.sceneModel.player.additionalState = GameObjectAdditionalState.WASHING_HANDS;
      this.sceneModel.handsWashed = true;
    }
  }

  buyProducts(): void {
    if (this.reader.checkGameObjectOnTile(this.sceneModel.player, PassableTile.SHOP)) {
      this.sceneModel.productsPicked = true;
      this.sceneModel.player.additionalState = GameObjectAdditionalState.CARRYING_PRODUCTS;
    }
  }

  // ---------------------------------------------- GAME-OBJECT METHODS ----------------------------------------------

  moveGameObjects(): void {
    this.sceneModel.gameObjects
      .filter((gameObject: GameObject) =>
        gameObject.type !== GameObjectType.PLAYER && gameObject.isMovable)
      .forEach((gameObject: GameObject) => {
        if (gameObject.chasing) {
          this.setChaseDirection(gameObject);
        }
        if (this.reader.checkWrongStep(this.reader.getNextStep(gameObject))) {
          this.turnOpposite(gameObject);
        }
        if (this.reader.checkWrongStep(this.reader.getNextStep(gameObject))) {
          return;
        }
        move(gameObject);
        gameObject.state = GameObjectState.MOVING;
      });
  }

  turnOpposite(gameObject: GameObject): void {
    gameObject.direction = moveDirections[gameObject.direction].oppositeDirection;
  }

  turnClockWise = (gameObject: GameObject) => {
    const numericDirectionValue = this.reader.getDirectionNumericValue(gameObject.direction);
    const nextDirectionNumericValue = (numericDirectionValue < 5)
      ? numericDirectionValue + 2
      : 0;
    gameObject.direction = Object.keys(moveDirections)
      .find((direction: Direction) => moveDirections[direction].numericValue === nextDirectionNumericValue) as Direction;
  }

  turnAntiClockWise = (gameObject: GameObject) => {
    const numericDirectionValue = this.reader.getDirectionNumericValue(gameObject.direction);
    const nextDirectionNumericValue = (numericDirectionValue > 0)
      ? numericDirectionValue - 2
      : 6;
    gameObject.direction = Object.keys(moveDirections)
      .find((direction: Direction) => moveDirections[direction].numericValue === nextDirectionNumericValue) as Direction;
  }


  setChaseDirection(monster: GameObject): void {
    let monsterTurnCallback;

    if (Math.abs(monster.position.x - this.sceneModel.player.position.x)
      >= Math.abs(monster.position.y - this.sceneModel.player.position.y)) {
      if (monster.position.x > this.sceneModel.player.position.x) {
        monster.direction = Direction.LEFT;
        monsterTurnCallback = (monster.position.y > this.sceneModel.player.position.y) ? this.turnClockWise : this.turnAntiClockWise;
      } else {
        monster.direction = Direction.RIGHT;
        monsterTurnCallback = (monster.position.y > this.sceneModel.player.position.y) ? this.turnAntiClockWise : this.turnClockWise;
      }
      if (monster.position.y === this.sceneModel.player.position.y) {
        monsterTurnCallback = monster.turnDirection === TurnDirection.CLOCKWISE ? this.turnAntiClockWise : this.turnClockWise;
        monster.turnDirection = monster.turnDirection === TurnDirection.CLOCKWISE ? TurnDirection.ANTICLOCKWISE : TurnDirection.CLOCKWISE;
      }
    } else {
      if (monster.position.y > this.sceneModel.player.position.y) {
        monster.direction = Direction.UP;
        monsterTurnCallback = (monster.position.x > this.sceneModel.player.position.x)
          ? this.turnAntiClockWise : this.turnClockWise;
      } else {
        monster.direction = Direction.DOWN;
        monsterTurnCallback = (monster.position.x > this.sceneModel.player.position.x)
          ? this.turnClockWise : this.turnAntiClockWise;
      }
      if (monster.position.x === this.sceneModel.player.position.x) {
        monsterTurnCallback = monster.turnDirection === TurnDirection.CLOCKWISE ? this.turnAntiClockWise : this.turnClockWise;
        monster.turnDirection = monster.turnDirection === TurnDirection.CLOCKWISE ? TurnDirection.ANTICLOCKWISE : TurnDirection.CLOCKWISE;
      }
    }

    if (this.reader.checkWrongStep(this.reader.getNextStep(monster))) {
      this.setAlternativeChaseDirection(monster, monsterTurnCallback);
    }
  }

  detectAndHandleGameObjectsCollisions(): void {
    const gameObjectCollisions: Collision[] = this.reader.getGameObjectsCollisions();
    if (gameObjectCollisions.length) {
      this.handleGameObjectCollisions(gameObjectCollisions);
    }
  }

  handleGameObjectCollisions(collisions: Collision[]): void {
    // will be implemented on demand (?)
  }

  setAlternativeChaseDirection = (monster: GameObject, turn) => {
    for (let i = 0; i < 2; i++) {
      turn(monster);
      if (!this.reader.checkWrongStep(this.reader.getNextStep(monster))) return;
    }
  }

  playerDisinfect(direction: number): void {
    const offsetDirection = Object.values(moveDirections)
      .find(moveDirection => moveDirection.numericValue === direction);

    timer(500).subscribe(() => {
      this.sceneModel.gameObjects = this.sceneModel.gameObjects.filter((gameObject: GameObject) =>
        gameObject.type !== GameObjectType.VIRUS
        || gameObject.position.x !== (this.sceneModel.player.position.x + offsetDirection.x)
        || gameObject.position.y !== (this.sceneModel.player.position.y + offsetDirection.y)
      );
    });
  }

  handlePlayerStateOnCompletion(): void {
    const levelPassed = this.sceneModelService.gameStatistics.levelPassed;
    this.setPlayerState(levelPassed ? GameObjectState.SUCCESS : GameObjectState.FAIL);
    this.setPlayerAdditionalState(null);
  }
}

const move = (entity: GameObject) => {
  entity.position.x += moveDirections[entity.direction].x;
  entity.position.y += moveDirections[entity.direction].y;
};

const getErrorMessage = (type: GameObjectType) => collisionMessages[type].errorMessage;
