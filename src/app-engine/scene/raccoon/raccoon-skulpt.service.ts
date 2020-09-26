import { Direction } from '../common/entities';
import { RaccoonWriterService } from './writers/raccoon-writer.service';
import { GameObjectType } from './entities';
import { RaccoonReaderService } from './readers/raccoon-reader.service';
import { RaccoonValidationService } from './raccoon-validation.service';
import { SceneSkulptService } from '../common/scene-skulpt-service';
import { RaccoonTrackerService } from './tracker/raccoon-tracker.service';
import { PlayerActionType } from './tracker/raccoon-tracker.types';
import { Singleton } from '../../singleton.decorator';
import { GameFailError } from '../common/errors';
declare const Sk: any;

@Singleton
export class RaccoonSkulptService implements SceneSkulptService {
  executionWasAborted = false;

  private validationService: RaccoonValidationService;

  constructor(private reader: RaccoonReaderService,
              private writer: RaccoonWriterService,
              private tracker: RaccoonTrackerService) {
    this.validationService = new RaccoonValidationService();
  }

  addApiToSkulpt(): void {
    Sk.builtins.raccoon = {
      goRight: (steps) => {
        this.validationService.validateGo(steps.v);
        this.performGameStep(() => this.writer.movePlayer(Direction.RIGHT));
        this.tracker.addPlayerAction({type: PlayerActionType.MOVE, payload: [Direction.RIGHT, steps]});
      },
      goLeft: (steps) => {
        this.validationService.validateGo(steps.v);
        this.performGameStep(() => this.writer.movePlayer(Direction.LEFT));
        this.tracker.addPlayerAction({type: PlayerActionType.MOVE, payload: [Direction.LEFT, steps]});
      },
      goUp: (steps) => {
        this.validationService.validateGo(steps.v);
        this.performGameStep(() => this.writer.movePlayer(Direction.UP));
        this.tracker.addPlayerAction({type: PlayerActionType.MOVE, payload: [Direction.UP, steps]});
      },
      goDown: (steps) => {
        this.validationService.validateGo(steps.v);
        this.performGameStep(() => this.writer.movePlayer(Direction.DOWN));
        this.tracker.addPlayerAction({type: PlayerActionType.MOVE, payload: [Direction.DOWN, steps]});
      },
      wait: (steps) => {
        this.validationService.validateWait(steps.v);
        this.performGameStep(() => this.writer.playerWait());
        this.tracker.addPlayerAction({type: PlayerActionType.WAIT});
      },
      inspect: (offsets: any) => {
        this.performGameStep(() => this.writer.playerWait());
        this.tracker.addPlayerAction({type: PlayerActionType.WAIT});
        return this.reader.inspect(this.validationService.validateInspect(offsets));
      },
      placeTurret: (args) => {
        this.validationService.validateEmptyMethod(args);
        this.performGameStep(() => this.writer.activateGameObject(GameObjectType.TURRET));
        this.tracker.addPlayerAction({type: PlayerActionType.ACTIVATE_GAME_OBJECT, payload: [GameObjectType.TURRET]});
      },
      setMine: (args) => {
        this.validationService.validateEmptyMethod(args);
        this.performGameStep(() => this.writer.activateGameObject(GameObjectType.MINE));
        this.tracker.addPlayerAction({type: PlayerActionType.ACTIVATE_GAME_OBJECT, payload: [GameObjectType.MINE]});
      }
    };
  }

  private performGameStep(action: () => void): void {
    this.throwErrorIfScriptIsStopped();
    this.writer.moveGameObjects();
    action();
    this.writer.detectAndHandleGameObjectsCollisions();
    this.writer.detectAndHandlePlayerCollisions();
  }

  private throwErrorIfScriptIsStopped(): void {
    if (this.executionWasAborted) throw new GameFailError('SCRIPT_STOPPED');
  }

}
