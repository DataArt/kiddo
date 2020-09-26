import { Component, OnInit, ViewChild, Self, Input } from '@angular/core';
import { delay, takeUntil, tap } from 'rxjs/operators';

import { ScriptRunnerService } from '../../app-engine/script-runner/script-runner.service';
import { ModalDirective } from 'src/app/shared/directives/modal/modal.directive';
import { GameStatistics } from '../../app-engine/scene/common/entities';
import { WinButton } from '../../app-engine/scene/common/entities';
import { Destroyed, GoogleAnalyticsService } from '../shared/services';
import { scriptExecutionState } from '../../app-engine/script-runner/script-runner.types';
import { SceneModelService } from '../../app-engine/scene/scene-model.service';
import { SceneReader } from '../../app-engine/scene/common/readers/scene.reader';
import { RaccoonReaderService } from '../../app-engine/scene/raccoon/readers/raccoon-reader.service';
import { SceneAccessorsService } from '../../app-engine/scene/scene-accessors.service';
import { SceneType } from '../../app-engine/scene/common/models/scene-type.enum';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'kiddo-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss'],
  providers: [Destroyed]
})
export class SceneComponent implements OnInit {

  @ViewChild('gameFinishModal') gameFinishModal: ModalDirective;
  sceneType: SceneType;
  statistics: GameStatistics = { gameFinished: false, levelPassed: false };
  scriptRunResult: string;
  prefixPath = 'SCENE-COMPONENT.';
  winButton: WinButton;
  @Input() isStatic: boolean;

  private sceneReader: SceneReader;
  private sceneModelService: SceneModelService;
  private sceneAccessorsService: SceneAccessorsService;

  constructor(
    @Self() private destroyed: Destroyed,
    private scriptRunnerService: ScriptRunnerService,
    private googleAnalyticsService: GoogleAnalyticsService,
  ) {
    this.sceneModelService = new SceneModelService();
    this.sceneAccessorsService = new SceneAccessorsService();
  }

  ngOnInit(): void {
    this.sceneType = this.sceneModelService.sceneModel.sceneType;
    this.sceneReader = this.sceneAccessorsService.reader;
    this.winButton = this.sceneModelService.winButton;

    if (!this.isStatic) {
      this.scriptRunnerService.executionState.pipe(
        tap(_ => this.statistics = this.sceneModelService.gameStatistics),
        delay(500),
        tap(state => (state === scriptExecutionState.FINISHED) && this.handleScriptFinish()),
        takeUntil(this.destroyed)
      ).subscribe();
    }

  }

  handleAcceptClick(): void {
    let url: URL;
    try {
      url = new URL(this.winButton.url);
    } catch (error) {
      url = new URL(this.winButton.url, window.location.href);
    }

    window.location.href = url.href;
  }

  handleResetClick(): void {
    this.scriptRunnerService.resetScene();
  }

  private handleScriptFinish(): void {
    this.scriptRunResult = '';
    this.statistics = this.sceneModelService.gameStatistics;
    if (this.statistics.failReason !== 'SCRIPT_STOPPED'
      || !(this.sceneReader as RaccoonReaderService).checkPlayerReachedFinish()) {
      this.scriptRunResult = this.statistics.levelPassed ? 'LEVEL_COMPLETE' : 'LEVEL_NOT_COMPLETE';
      this.gameFinishModal.open();
    }

    this.googleAnalyticsService.emitEvent(
      environment.googleAnalytics.events.gameFinish,
      `Level path: '${window.location.pathname}'. Passed: ${this.statistics.levelPassed}. `
    );

    if (this.statistics.levelPassed) {
      this.setLevelAsPassed();
    }
  }

  setLevelAsPassed(): void {
    const path = window.location.pathname;

    let passedLevelsList = JSON.parse(localStorage.getItem('kiddo-passed-levels')) ?? [];
    passedLevelsList = [...new Set([...passedLevelsList, path])];
    localStorage.setItem('kiddo-passed-levels', JSON.stringify(passedLevelsList));
  }

}
