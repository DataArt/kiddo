import {Injectable} from '@angular/core';
import {Direction} from '../common/entities';
import {PandemicWriterService} from './writers/pandemic-writer.service';
import {PandemicReaderService} from './readers/pandemic-reader.service';
import {PandemicValidationService} from './pandemic-validation.service';
import {SceneSkulptService} from '../common/scene-skulpt-service';
import {Singleton} from 'src/app-engine/singleton.decorator';
import {GameFailError} from '../common/errors';
import {SkulptService} from '../../script-runner/skulpt.service';
import {SkulptModuleInjectorService} from '../../script-runner/skulpt-module-injector.service';
import {PlayerActionType} from '../raccoon/tracker/raccoon-tracker.types';
import {rejects} from 'assert';
import {GameObjectType} from '../raccoon/entities';

declare const Sk: any;

@Singleton
export class PandemicSkulptService implements SceneSkulptService {

    executionWasAborted = false;

    private validationService: PandemicValidationService;

    constructor(private skulptService: SkulptService,
                private reader: PandemicReaderService,
                private writer: PandemicWriterService,
    ) {
        this.validationService = new PandemicValidationService();
    }

    addApiToSkulpt(): void {
        const injector: SkulptModuleInjectorService = this.skulptService.getModuleInjector();
        injector.removeAllInjectedModules();

        const defaultDelay = 500;

        const executeWithDelay = (callback: any, delay: number, repeat: number) => {
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

        injector.addModule('player', {
            alert: (s: string) => {
                alert(s);
            },

            go_right: (steps: any = 1) => {
                if (typeof steps === 'number' && steps > 0) {
                    return executeWithDelay(() => {
                        this.validationService.validateGo(steps);
                        this.performGameStep(() => this.writer.movePlayer(Direction.RIGHT));
                    }, defaultDelay, steps as number);
                }
            },

            go_left: (steps: any = 1) => {
                if (typeof steps === 'number' && steps > 0) {
                    return executeWithDelay(() => {
                        this.validationService.validateGo(steps);
                        this.performGameStep(() => this.writer.movePlayer(Direction.LEFT));
                    }, defaultDelay, steps as number);
                }
            },

            go_up: (steps: any = 1) => {
                if (typeof steps === 'number' && steps > 0) {
                    return executeWithDelay(() => {
                        this.validationService.validateGo(steps);
                        this.performGameStep(() => this.writer.movePlayer(Direction.UP));
                    }, defaultDelay, steps as number);
                }
            },

            go_down: (steps: any = 1) => {
                if (typeof steps === 'number' && steps > 0) {
                    return executeWithDelay(() => {
                        this.validationService.validateGo(steps);
                        this.performGameStep(() => this.writer.movePlayer(Direction.DOWN));
                    }, defaultDelay, steps as number);
                }
            },

            wait: (steps: any = 1) => {
                if (typeof steps === 'number' && steps > 0) {
                    return executeWithDelay(() => {
                        this.validationService.validateWait(steps);
                        this.performGameStep(() => this.writer.playerWait());
                    }, defaultDelay, steps as number);
                }
            },

            look: (...offsets: any) => {
                return new Promise((resolve, reject) => {
                    Sk.setTimeout(() => {
                        try {
                            this.performGameStep(() => this.writer.playerWait());
                            resolve(this.reader.look(this.validationService.validateLook(offsets)));
                        } catch (error) {
                            reject(error);
                        }
                    }, 500);
                });
            },

            putOnMask: (args) => {
                return executeWithDelay(() => {
                    this.validationService.validateEmptyMethod(args);
                    this.performGameStep(() => this.writer.putOnMask());
                }, defaultDelay, 1);
            },

            washHands: (args) => {
                return executeWithDelay(() => {
                    this.validationService.validateEmptyMethod(args);
                    this.performGameStep(() => this.writer.washHands());
                }, defaultDelay, 1);
            },

            disinfect: (direction: number) => {
                return executeWithDelay(() => {
                    this.validationService.validateDisinfect(direction);
                    this.writer.playerDisinfect(direction);
                }, defaultDelay, 1);
            },

            getProducts: (args) => {
                return executeWithDelay(() => {
                    this.validationService.validateEmptyMethod(args);
                    this.performGameStep(() => this.writer.buyProducts());
                }, defaultDelay, 1);
            },
        });
    }

    private performGameStep(action: () => void): void {
        this.throwErrorIfScriptIsStopped();
        this.writer.moveGameObjects();
        this.writer.detectAndHandleGameObjectsCollisions();
        action();
        this.writer.detectAndHandlePlayerCollisions();
    }

    private throwErrorIfScriptIsStopped(): void {
        if (this.executionWasAborted) throw new GameFailError('SCRIPT_STOPPED');
    }
}
