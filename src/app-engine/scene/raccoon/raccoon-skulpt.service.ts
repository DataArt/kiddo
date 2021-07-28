import {Direction} from '../common/entities';
import {RaccoonWriterService} from './writers/raccoon-writer.service';
import {GameObjectType} from './entities';
import {RaccoonReaderService} from './readers/raccoon-reader.service';
import {RaccoonValidationService} from './raccoon-validation.service';
import {SceneSkulptService} from '../common/scene-skulpt-service';
import {RaccoonTrackerService} from './tracker/raccoon-tracker.service';
import {PlayerActionType} from './tracker/raccoon-tracker.types';
import {Singleton} from '../../singleton.decorator';
import {GameFailError} from '../common/errors';
import {SkulptService} from '../../script-runner/skulpt.service';
import {SkulptModuleInjectorService} from '../../script-runner/skulpt-module-injector.service';

declare const Sk: any;

@Singleton
export class RaccoonSkulptService implements SceneSkulptService {
    executionWasAborted = false;

    private validationService: RaccoonValidationService;

    constructor(private skulptService: SkulptService,
                private reader: RaccoonReaderService,
                private writer: RaccoonWriterService,
                private tracker: RaccoonTrackerService
    ) {
        this.validationService = new RaccoonValidationService();
    }

    addApiToSkulpt(): void {
        const injector: SkulptModuleInjectorService = this.skulptService.getModuleInjector();
        injector.removeAllInjectedModules();

        const defaultDelay = 500;

        const executeWithDelay = (callback: () => void, delay: number, repeat: number) => {
            return new Promise<any>(
                (resolve, reject) => {
                    for (let i = 0; i < repeat; i++) {
                        setTimeout(() => {
                            try {
                                callback();
                            } catch (e) {
                                reject(e);
                            }
                        }, delay * (i + 1));
                    }
                    setTimeout(resolve, delay * repeat);
                }
            );
        };

        injector.addModule('raccoon', {
            alert: (s: string) => {
                alert(s);
            },

            go_right: (steps: any = 1) => {
                if (typeof steps === 'number' && steps > 0) {
                    return executeWithDelay(() => {
                        this.validationService.validateGo(steps);
                        this.performGameStep(() => this.writer.movePlayer(Direction.RIGHT));
                        this.tracker.addPlayerAction({type: PlayerActionType.MOVE, payload: [Direction.RIGHT, steps]});
                    }, defaultDelay, steps as number);
                }
            },

            go_left: (steps: any = 1) => {
                if (typeof steps === 'number' && steps > 0) {
                    return executeWithDelay(() => {
                        this.validationService.validateGo(steps);
                        this.performGameStep(() => this.writer.movePlayer(Direction.LEFT));
                        this.tracker.addPlayerAction({type: PlayerActionType.MOVE, payload: [Direction.LEFT, steps]});
                    }, defaultDelay, steps as number);
                }
            },

            go_up: (steps: any = 1) => {
                if (typeof steps === 'number' && steps > 0) {
                    return executeWithDelay(() => {
                        this.validationService.validateGo(steps);
                        this.performGameStep(() => this.writer.movePlayer(Direction.UP));
                        this.tracker.addPlayerAction({type: PlayerActionType.MOVE, payload: [Direction.UP, steps]});
                    }, defaultDelay, steps as number);
                }
            },

            go_down: (steps: any = 1) => {
                if (typeof steps === 'number' && steps > 0) {
                    return executeWithDelay(() => {
                        this.validationService.validateGo(steps);
                        this.performGameStep(() => this.writer.movePlayer(Direction.DOWN));
                        this.tracker.addPlayerAction({type: PlayerActionType.MOVE, payload: [Direction.DOWN, steps]});
                    }, defaultDelay, steps as number);
                }
            },

            wait: (steps: any = 1) => {
                if (typeof steps === 'number' && steps > 0) {
                    return executeWithDelay(() => {
                        this.validationService.validateWait(steps);
                        this.performGameStep(() => this.writer.playerWait());
                        this.tracker.addPlayerAction({type: PlayerActionType.WAIT});
                    }, defaultDelay, steps as number);
                }
            },

            inspect: (...offsets: any) => {
                return new Promise((resolve, reject) => {
                    Sk.setTimeout(() => {
                        try {
                            this.performGameStep(() => this.writer.playerWait());
                            this.tracker.addPlayerAction({type: PlayerActionType.WAIT});
                            resolve(this.reader.inspect(this.validationService.validateInspect(offsets)));
                        } catch (error) {
                            reject(error);
                        }
                    }, 500);
                });
            },

            place_turret: (args) => {
                return executeWithDelay(() => {
                    this.validationService.validateEmptyMethod(args);
                    this.performGameStep(() => this.writer.activateGameObject(GameObjectType.TURRET));
                    this.tracker.addPlayerAction({type: PlayerActionType.ACTIVATE_GAME_OBJECT, payload: [GameObjectType.TURRET]});
                }, defaultDelay, 1);
            },

            set_mine: (args) => {
                return executeWithDelay(() => {
                    this.validationService.validateEmptyMethod(args);
                    this.performGameStep(() => this.writer.activateGameObject(GameObjectType.MINE));
                    this.tracker.addPlayerAction({type: PlayerActionType.ACTIVATE_GAME_OBJECT, payload: [GameObjectType.MINE]});
                }, defaultDelay, 1);
            },
        });
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
