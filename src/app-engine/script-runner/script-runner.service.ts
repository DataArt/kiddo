import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { GameFailError } from 'src/app-engine/scene/common/errors';
import { GameStatistics } from '../scene/common/entities';
import { TerminalService } from 'src/app/code-editor/terminal/terminal.service';
import { I18nFactoryService } from 'src/app/shared/services/i18n-factory.service';
import { switchMap, takeWhile, tap } from 'rxjs/operators';
import { SkulptService } from './skulpt.service';
import { scriptExecutionState } from './script-runner.types';
import { SceneModelService } from '../scene/scene-model.service';
import { SceneConfig } from '../scene/common/scene-config';
import { RaccoonWriterService } from '../scene/raccoon/writers/raccoon-writer.service';
import { PandemicWriterService } from '../scene/pandemic/writers/pandemic-writer.service';
import { SceneAccessorsService } from '../scene/scene-accessors.service';
import { SceneInitService } from '../scene/scene-init.service';
import { GoogleAnalyticsService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ScriptRunnerService {
  executionState = new BehaviorSubject(scriptExecutionState.READY);

  playbackIsRunning = new BehaviorSubject(false);

  private finishMessagePrinted = false;

  private initialSceneConfig: SceneConfig;

  private prefixPath = 'CODE-EDITOR.SERVICE.';

  private scenePlayback = interval(500).pipe(
    tap(_ => (this.sceneAccessorsService.writer as RaccoonWriterService | PandemicWriterService).moveGameObjects()),
    switchMap(_ => this.playbackIsRunning),
    takeWhile(Boolean)
  );

  private readonly sceneInitService: SceneInitService;
  private readonly sceneModelService: SceneModelService;
  private readonly sceneAccessorsService: SceneAccessorsService;
  constructor(
    private terminalService: TerminalService,
    private i18n: I18nFactoryService,
    private skulptService: SkulptService,
    private googleAnalyticsService: GoogleAnalyticsService,
  ) {
    this.sceneModelService = new SceneModelService();
    this.sceneAccessorsService = new SceneAccessorsService();
    this.sceneInitService = new SceneInitService(this.sceneModelService, this.sceneAccessorsService, this.skulptService);
  }

  translate = this.i18n.translate(this.prefixPath);

  initializeScene(config: SceneConfig): void {
    this.initialSceneConfig = config;
    this.sceneInitService.init(config);
    this.terminalService.print(`SCENE.${this.sceneAccessorsService.reader.sceneModel.sceneType.toUpperCase()}.SERVICE.SCENE_ESTABLISHED`);
    this.sceneModelService.resetStatistics();
    this.skulptService.configureSkulpt();
    this.sceneAccessorsService.addApiToSkulpt();
    this.resetScene();
  }

  async runScript(script: string): Promise<void> {
    this.resetScene();
    this.executionState.next(scriptExecutionState.RUNNING);
    this.terminalService.print('CODE-EDITOR.SERVICE.EXECUTING_SCRIPT');
    try {
      await this.skulptService.executeSkulpt(script);
      this.processScriptCompletion();
    } catch (err) {
      this.processScriptFail(err);
    }
  }

  stopScript(reachedFinalReason: boolean = false): void {
    if (reachedFinalReason) {
      this.sceneModelService.updateStatistics({
        gameFinished: true,
        levelPassed: true,
      });
    } else {
      this.sceneModelService.updateStatistics({
        gameFinished: true,
        levelPassed: false,
        failReason: 'SCRIPT_STOPPED',
        failRowNumber: 0,
      });
    }

    this.sceneAccessorsService.sceneSkulptService.executionWasAborted = true;
    this.executionState.next(scriptExecutionState.FINISHED);
  }

  startScenePlayback(): void {
    this.playbackIsRunning.next(true);
    this.scenePlayback.subscribe();
  }

  stopScenePlayback(): void {
    this.resetScene();
  }

  resetScene(): void {
    this.playbackIsRunning.next(false);
    this.sceneModelService.resetStatistics();
    this.sceneInitService.init(this.initialSceneConfig);
    this.finishMessagePrinted = false;
    this.sceneAccessorsService.sceneSkulptService.executionWasAborted = false;
    this.executionState.next(scriptExecutionState.READY);
  }

  private processScriptCompletion(): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.info, 'script-runner: script_execution_finish');

    const statistics = this.sceneAccessorsService.reader.getGameStatistics();
    const failReason = this.sceneAccessorsService.reader.getGameFailMessage();
    if (!failReason) {
      statistics.levelPassed = true;
    } else {
      statistics.failReason = failReason;
    }
    this.sceneModelService.updateStatistics(statistics);

    const message = statistics.levelPassed
      ? 'SCENE-COMPONENT.LEVEL_COMPLETE'
      : `SCENE-COMPONENT.${this.sceneAccessorsService.reader.getSceneType()}.FAIL_REASON.${statistics.failReason}`;
    if (!this.finishMessagePrinted) {
      this.terminalService.print(message);
      this.finishMessagePrinted = true;
    }
    this.executionState.next(scriptExecutionState.FINISHED);
  }

  private processScriptFail(err: SkulptError): void {
    console.log(err);
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.info, 'script-runner: script_execution_fail');

    const gameStatistics: GameStatistics = this.sceneAccessorsService.reader.getGameStatistics();
    gameStatistics.levelPassed = false;
    gameStatistics.failRowNumber = err.traceback.length ? err.traceback[0].lineno : 1;
    if (err.nativeError instanceof GameFailError) {
      gameStatistics.failReason = err.nativeError.message;

      this.terminalService.print(
        `SCENE-COMPONENT.${this.sceneAccessorsService.reader.getSceneType()}.FAIL_REASON.${gameStatistics.failReason}`
      );
    } else {
      gameStatistics.failReason = 'COULD_NOT_COMPILE_SCRIPT';
      console.log(err);
      this.terminalService.print(`${this.translate('COULD_NOT_COMPILE_SCRIPT')}: ${err.toString()}`);
    }
    this.sceneModelService.updateStatistics(gameStatistics);
    this.executionState.next(scriptExecutionState.FINISHED);
  }

}

interface SkulptError {
  nativeError: Error;
  traceback: {
    lineno: number,
    colno: number,
    filename: string
  }[];
}
