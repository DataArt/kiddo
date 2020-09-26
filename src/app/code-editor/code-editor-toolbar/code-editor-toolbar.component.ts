import { Component, ViewChild, OnInit } from '@angular/core';
import { GoogleAnalyticsService, ScenePositionService } from '../../shared/services';
import { CodeEditorService } from '../code-editor-service/code-editor.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CodeSaverService } from '../code-saver/code-saver.service';
import { ModalDirective } from '../../shared/directives/modal/modal.directive';
import { ScriptRunnerService } from '../../../app-engine/script-runner/script-runner.service';
import { TerminalService } from '../terminal/terminal.service';
import { SnackbarDirective } from '../../shared/directives/snackbar/snackbar.directive';
import { scriptExecutionState } from '../../../app-engine/script-runner/script-runner.types';
import { SceneModelService } from '../../../app-engine/scene/scene-model.service';
import { SceneAccessorsService } from '../../../app-engine/scene/scene-accessors.service';
import { environment } from 'src/environments/environment';
import { ConfigurationService } from 'src/app/config/configuration.service';

@Component({
  selector: 'kiddo-code-editor-toolbar',
  templateUrl: './code-editor-toolbar.component.html',
  styleUrls: ['./code-editor-toolbar.component.scss']
})
export class CodeEditorToolbarComponent implements OnInit {

  saveErrorMessage: string;
  hideLangSelectionDropdown = false;

  prefixTooltip = 'CODE-EDITOR.TOOLTIP.';
  prefixOptions = 'CODE-EDITOR.OPTIONS.';
  prefixButton = 'CODE-EDITOR.BUTTON.';
  prefixModal = 'CODE-EDITOR.MODAL.';
  prefixSnackbar = 'CODE-EDITOR.SNACKBAR.';
  playbackIsLaunched = this.scriptRunnerService.playbackIsRunning;
  launchButtonState = this.scriptRunnerService.executionState
    .pipe(
      map(state => {
        if (state === scriptExecutionState.READY) return 'play';
        if (state === scriptExecutionState.RUNNING) return 'stop';
        if (state === scriptExecutionState.FINISHED) return 'replay';
      })
    );

  @ViewChild('initialCodeModal') initialCodeModal: ModalDirective;
  @ViewChild('saveCodeModal') saveCodeModal: ModalDirective;
  @ViewChild('saveSnackbar') saveSnackbar: SnackbarDirective;
  @ViewChild('helpModal') helpModal: ModalDirective;

  get allLangs(): string[] {
    return this.translateService.getLangs();
  }

  get currentLang(): string {
    return this.translateService.currentLang;
  }

  private sceneModelService: SceneModelService;
  private sceneAccessorsService: SceneAccessorsService;
  constructor(
    private codeEditorService: CodeEditorService,
    private scenePositionService: ScenePositionService,
    private translateService: TranslateService,
    private terminalService: TerminalService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private codeSaverService: CodeSaverService,
    private scriptRunnerService: ScriptRunnerService,
    private configService: ConfigurationService,
  ) {
    this.sceneModelService = new SceneModelService();
    this.sceneAccessorsService = new SceneAccessorsService();
  }

  ngOnInit(): void {
    this.codeEditorService.initialize();
    this.hideLangSelectionDropdown = Boolean(this.configService.getLanguageConfiguration().useOnly);
  }

  onLaunchButtonClick(): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'code-editor: launch_click');
    this.launchButtonState.pipe(
      take(1)
    )
      .subscribe(state => {
        // NOTICE! This logic strongly relies on methods naming.
        // It allows one-line solution in change of switch/case or map,
        // but could be broken once the naming changes. So pay attention!
        this[state]();
      });
  }

  getLaunchButtonColor(): Observable<string> {
    const colorsLookup = {
      play: 'green',
      stop: 'red',
      replay: 'blue'
    };
    return this.launchButtonState.pipe(
      map(state => colorsLookup[state])
    );
  }


  play(): void {
    this.googleAnalyticsService.emitEvent(
      environment.googleAnalytics.events.buttonClick, 'code-editor: run_script_click', this.codeEditorService.userCode
    );
    this.playbackIsLaunched.next(false);
    this.terminalService.open();
    this.scenePositionService.openScene();
    this.scriptRunnerService.runScript(this.codeEditorService.userCode);
  }

  stop(): void {
    this.googleAnalyticsService.emitEvent(
      environment.googleAnalytics.events.buttonClick, 'code-editor: stop_script_click', this.codeEditorService.userCode
    );
    this.scriptRunnerService.stopScript();
  }

  replay(): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'code-editor: replay_script_click');
    this.scriptRunnerService.resetScene();
  }

  resetApp(): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'code-editor: rerender_app_click');
    this.scriptRunnerService.resetScene();
  }

  onPlaybackClick(): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'code-editor: playback_scene_click');
    this.playbackIsLaunched.pipe(
      take(1)
    )
      .subscribe(
        isLaunched => {
          if (!isLaunched) {
            this.playbackIsLaunched.next(true);
            this.scriptRunnerService.startScenePlayback();
            this.scenePositionService.openScene();
          } else {
            this.playbackIsLaunched.next(false);
            this.scriptRunnerService.stopScenePlayback();
          }
        });
  }

  async onSaveClick(name?: string): Promise<void> {
    try {
      await this.codeSaverService.saveSolution(this.codeEditorService.userCode, name);
      this.saveCodeModal.close();
      this.saveSnackbar.open();
      this.saveErrorMessage = '';
    } catch {
      this.saveErrorMessage = this.prefixModal + 'SAVE_NAME_EXISTS';
    }
  }

  onLoad(code: string): void {
    this.codeEditorService.userCode = code;
  }

  async handleLangChange(lang: string): Promise<void> {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.dropdownClick, 'code-editor: language_change_click');
    lang = lang.toLowerCase();
    this.translateService.use(lang);
    localStorage.setItem('kiddoLanguage', lang);
  }

  onResetCodeClick(): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'code-editor: reset_to_initial_code_click');
    this.codeEditorService.setInitialUserScript();
    this.initialCodeModal.close();
  }

  onOpenModalClick(el: ModalDirective, gaEventAction: string): void {
    if (gaEventAction) {
      this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, `code-editor: ${gaEventAction}`);
    }
    el.open();
  }

  closeSaveCodeModal(): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'code-editor: close_save_modal_click');
    this.saveErrorMessage = '';
    this.saveCodeModal.close();
  }

  setIDELeft(): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'code-editor: set_IDE_left_click');
    this.scenePositionService.setSceneRight();
  }

  setIDERight(): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'code-editor: set_IDE_right_click');
    this.scenePositionService.setSceneLeft();
  }

  sceneIsPlaybackable(): boolean {
    return this.sceneAccessorsService.sceneIsPlaybackable;
  }

  sceneHasTaskDescription(): boolean {
    return !!this.sceneModelService.taskDescription;
  }
}
