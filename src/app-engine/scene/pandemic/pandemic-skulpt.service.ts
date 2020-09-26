import { Injectable } from '@angular/core';
import { Direction } from '../common/entities';
import { PandemicWriterService } from './writers/pandemic-writer.service';
import { PandemicReaderService } from './readers/pandemic-reader.service';
import { PandemicValidationService } from './pandemic-validation.service';
import { SceneSkulptService } from '../common/scene-skulpt-service';

declare const Sk: any;

@Injectable({
  providedIn: 'root'
})
export class PandemicSkulptService implements SceneSkulptService {

  executionWasAborted = false;

  private validationService: PandemicValidationService;

  constructor(private reader: PandemicReaderService,
              private writer: PandemicWriterService,
  ) {
    this.validationService = new PandemicValidationService();
  }

  addApiToSkulpt(): void {
    Sk.builtins.player = {
      goRight: (steps) => {
        this.validationService.validateGo(steps.v);
        this.performGameStep(() => this.writer.movePlayer(Direction.RIGHT));
      },
      goLeft: (steps) => {
        this.validationService.validateGo(steps.v);
        this.performGameStep(() => this.writer.movePlayer(Direction.LEFT));
      },
      goUp: (steps) => {
        this.validationService.validateGo(steps.v);
        this.performGameStep(() => this.writer.movePlayer(Direction.UP));
      },
      goDown: (steps) => {
        this.validationService.validateGo(steps.v);
        this.performGameStep(() => this.writer.movePlayer(Direction.DOWN));
      },
      wait: (steps) => {
        this.validationService.validateWait(steps.v);
        this.performGameStep(() => this.writer.playerWait());
      },
      look: (offsets: any) => {
        this.performGameStep(() => this.writer.playerWait());
        return this.reader.look(this.validationService.validateLook(offsets));
      },
      putOnMask: (args) => {
        this.validationService.validateEmptyMethod(args);
        this.performGameStep(() => this.writer.putOnMask());
      },
      washHands: (args) => {
        this.validationService.validateEmptyMethod(args);
        this.performGameStep(() => this.writer.washHands());
      },
      disinfect: (direction: number) => this.performGameStep(() => {
        this.validationService.validateDisinfect(direction);
        return this.writer.playerDisinfect(direction);
      }),
      getProducts: (args) => {
        this.validationService.validateEmptyMethod(args);
        this.performGameStep(() => this.writer.buyProducts());
      }
    };
  }

  private performGameStep(action: () => void): void {
    this.writer.moveGameObjects();
    this.writer.detectAndHandleGameObjectsCollisions();
    action();
    this.writer.detectAndHandlePlayerCollisions();
  }
}
