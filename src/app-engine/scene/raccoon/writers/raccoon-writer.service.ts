import { SceneWriter } from '../../common/writers/scene.writer';
import { Coords, Direction, moveDirections, RaccoonGameStatistics, TurnDirection } from '../../common/entities';
import { RaccoonSceneModel } from '../models/raccoon-scene-model';
import { GameObject, GameObjectAdditionalState, GameObjectState, GameObjectType } from '../entities';
import { RaccoonReaderService } from '../readers/raccoon-reader.service';
import { GameFailError } from '../../common/errors';
import { SceneModelService } from '../../scene-model.service';
import { timer } from 'rxjs';
import { Collision, collisionMessages } from '../entities/collision';
import { delay, take, tap } from 'rxjs/operators';
import { Singleton } from '../../../singleton.decorator';

@Singleton
export class RaccoonWriterService implements SceneWriter {
  private sceneModel: RaccoonSceneModel;

  constructor(private sceneModelService: SceneModelService,
              private reader: RaccoonReaderService) {
  }

  init(): void {
    this.sceneModel = this.sceneModelService.sceneModel as RaccoonSceneModel;
  }

  // ------------------------------ PLAYER ---------------------------------

  movePlayer(direction: Direction): void {
    this.setPlayerDirection(direction);
    if (this.reader.checkIfMovedOverGameFieldEdge(this.reader.getNextStep(this.sceneModel.player))) {
      this.handleGameFail('OFF_MAP');
    }
    move(this.sceneModel.player);
    this.sceneModel.player.state = GameObjectState.MOVING;
    if (this.reader.checkInvalidPosition(this.sceneModel.player.position)) {
      this.handleGameFail('OFF_ROAD');
    }
    this.sceneModelService.updateStatistics({
      cellsPassed: ((this.sceneModelService.gameStatistics as RaccoonGameStatistics).cellsPassed || 0) + 1
    });
  }

  playerWait(): void {
    this.sceneModel.player.state = GameObjectState.DEFAULT;
  }

  handlePlayerStateOnCompletion(): void {
    const levelPassed = this.sceneModelService.gameStatistics.levelPassed;
    this.setPlayerState(levelPassed ? GameObjectState.SUCCESS : GameObjectState.FAIL);
    this.setPlayerAdditionalState(null);
  }

  activateGameObject(gameObjectType: GameObjectType): void {
    const targetItemIndex: number = this.sceneModel.player.inventory.findIndex((item: GameObject) => item.type === gameObjectType);
    const targetItem: GameObject = this.sceneModel.player.inventory.splice(targetItemIndex, 1)[0];
    if (targetItem) {
      this.sceneModel.player.state = GameObjectState.DEFAULT;
      targetItem.state = GameObjectState.ACTIVATED;
      targetItem.position = {...this.sceneModel.player.position};
      this.sceneModel.gameObjects.push(targetItem);
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

  private handlePlayerCollisions(collisions: GameObject[]): void {
    collisions.forEach((item: GameObject) => {
      if (item.isPickable && item.state === GameObjectState.DEFAULT) {
        this.pickGameObject(item);
      }
      // NOTICE! This condition assumes all movable game objects are hostile, might cause bugs once
      // we have movable friendly game objects
      if (item.isMovable) {
        this.handleGameFail(getErrorMessage(item.type));
      }
      if (item.type === GameObjectType.GATES) {
        this.handlePlayerGatesAction(item);
      }
    });
  }

  private setPlayerDirection(direction: Direction): void {
    this.sceneModel.player.direction = direction;
  }

  private setPlayerState(newState: GameObjectState): void {
    this.sceneModel.player.state = newState;
  }

  private setPlayerAdditionalState(newState: GameObjectAdditionalState): void {
    this.sceneModel.player.additionalState = newState;
  }

  private pickGameObject(gameObject: GameObject): void {
    this.sceneModel.gameObjects.splice(this.sceneModel.gameObjects.indexOf(gameObject), 1);
    gameObject.state = GameObjectState.PICKED;
    this.sceneModel.player.inventory.push(gameObject);
  }

  private handlePlayerGatesAction(gates: GameObject): void {
    const key: GameObject = this.sceneModel.player.inventory
      .find((item: GameObject) => item.type === GameObjectType.KEY && item.additionalState === gates.additionalState);
    if (key) {
      gates.state = GameObjectState.OPEN;
      if (!this.reader.getGameObjectsOfType(GameObjectType.GATES, GameObjectState.DEFAULT, key.additionalState).length) {
        this.sceneModel.player.inventory = this.sceneModel.player.inventory.filter((item: GameObject) => item.id !== key.id);
      }
    } else {
      this.handleGameFail(getErrorMessage(gates.type));
    }
  }

  // ---------------------- GAME-OBJECTS ------------------------------

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
          if (this.reader.checkWrongStep(this.reader.getNextStep(gameObject))) {
            return;
          }
        }
        move(gameObject);
        gameObject.state = GameObjectState.MOVING;
      });
  }

  detectAndHandleGameObjectsCollisions(): void {
    const gameObjectCollisions: Collision[] = this.reader.getGameObjectsCollisions();
    if (gameObjectCollisions.length) {
      this.handleGameObjectsCollisions(gameObjectCollisions);
    }
  }

  private handleGameObjectsCollisions(collisions: Collision[]): void {
    collisions.forEach((collision: Collision) => {
      if (collision.secondObject.type === GameObjectType.MINE && collision.secondObject.state === GameObjectState.ACTIVATED) {
        this.destroyMonsterByMine(collision.secondObject, collision.firstObject);
      }
      if (collision.secondObject.type === GameObjectType.TURRET && collision.secondObject.state === GameObjectState.ACTIVATED) {
        this.shootMonster(collision.secondObject, collision.firstObject);
      }
    });
  }

  private turnOpposite(gameObject: GameObject): void {
    gameObject.direction = moveDirections[gameObject.direction].oppositeDirection;
  }

  private turnClockWise = (gameObject: GameObject): void => {
    const numericDirectionValue = this.reader.getDirectionNumericValue(gameObject.direction);
    const nextDirectionNumericValue = (numericDirectionValue < 5)
      ? numericDirectionValue + 2
      : 0;
    gameObject.direction = Object.keys(moveDirections)
      .find((direction: Direction) => moveDirections[direction].numericValue === nextDirectionNumericValue) as Direction;
  }

  private turnAntiClockWise = (gameObject: GameObject): void => {
    const numericDirectionValue = this.reader.getDirectionNumericValue(gameObject.direction);
    const nextDirectionNumericValue = (numericDirectionValue > 0)
      ? numericDirectionValue - 2
      : 6;
    gameObject.direction = Object.keys(moveDirections)
      .find((direction: Direction) => moveDirections[direction].numericValue === nextDirectionNumericValue) as Direction;
  }


  private setChaseDirection(monster: GameObject): void {
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

  private setAlternativeChaseDirection(monster: GameObject, turn: any): void {
    for (let i = 0; i < 2; i++) {
      turn(monster);
      if (!this.reader.checkWrongStep(this.reader.getNextStep(monster))) return;
    }
  }

  private shootMonster(turret: GameObject, monster: GameObject): void {
    const offset = {x: monster.position.x - turret.position.x, y: monster.position.y - turret.position.y};
    this.setTurretDirection(turret, offset);
    timer(500).pipe(
      tap(() => {
        turret.state = GameObjectState.FIRES;
        const monsterId = this.sceneModel.gameObjects.findIndex((item: GameObject) => item.id === monster.id);
        this.sceneModel.gameObjects.splice(monsterId, 1);
        turret.additionalState = GameObjectAdditionalState.RIGHT;
      }),
      delay(500),
      tap(() => turret.state = GameObjectState.ACTIVATED),
      take(1)
    ).subscribe();
  }

  private destroyMonsterByMine(mine: GameObject, monster: GameObject): void {
    mine.state = GameObjectState.FIRES;
    timer(500).pipe(
      tap(() => {
        const mineIndex = this.sceneModel.gameObjects.findIndex(item => item.id === mine.id);
        const monsterIndex = this.sceneModel.gameObjects.findIndex(item => item.id = monster.id);
        this.sceneModel.gameObjects.splice(mineIndex, 1);
        this.sceneModel.gameObjects.splice(monsterIndex, 1);
      }),
      take(1)
    ).subscribe();
  }

  private handleGameFail(failMessage: string): void {
    this.setPlayerState(GameObjectState.FAIL);
    this.setPlayerAdditionalState(null);
    throw new GameFailError(failMessage);
  }

  private setTurretDirection(turret: GameObject, offset: Coords): void {
    const stringTurretDirection: string = Object.keys(moveDirections)
      .find(direction => moveDirections[direction].x === offset.x
        && moveDirections[direction].y === offset.y);

    turret.direction = Direction[Object.keys(Direction)
      .find(key => Direction[key] === stringTurretDirection)];
    turret.additionalState = GameObjectAdditionalState[Object.keys(GameObjectAdditionalState)
      .find((state) => GameObjectAdditionalState[state] === stringTurretDirection)];
  }

}

const move = (entity: GameObject) => {
  entity.position.x += moveDirections[entity.direction].x;
  entity.position.y += moveDirections[entity.direction].y;
};

const getErrorMessage = (type: GameObjectType) => collisionMessages[type].errorMessage;
