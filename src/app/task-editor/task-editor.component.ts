import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { CdkStep } from '@angular/cdk/stepper';
import { KiddoInitService } from '../kiddo-init.service';
import { TaskEditorService } from '../shared/services/task-editor.service';
import { ModalDirective } from '../shared/directives/modal/modal.directive';
import { GoogleAnalyticsService } from '../shared/services';
import { ConfigurationService } from '../config/configuration.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'kiddo-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrls: ['./task-editor.component.scss']
})
export class TaskEditorComponent implements OnInit, AfterViewInit {

  noConfig: Observable<boolean>;
  isLoaded: Observable<boolean>;
  @ViewChild('helpModal') helpModal: ModalDirective;
  showHelpIntroduction: Observable<boolean>;
  dontShowMessaggeOnStart = false;
  appConfigLoaded: Observable<boolean> = this.configService.appConfigLoaded;


  constructor(
    private kiddoInitService: KiddoInitService,
    private taskEditorService: TaskEditorService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private configService: ConfigurationService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.noConfig = this.kiddoInitService.noConfig;
    this.isLoaded = this.kiddoInitService.isLoaded;
    this.taskEditorService.initIntroductionStatus();
    this.showHelpIntroduction = this.taskEditorService.getIntroductionStatus();
  }

  ngAfterViewInit(): void {
    this.showHelpIntroduction.subscribe((value: boolean) => {
      if (value) {
        this.openeHelp();
        this.ref.detectChanges();
      }
    });
  }

  setStepStatus(step: CdkStep, status: boolean): void {
    step.completed = status;
  }

  openeHelp(): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'task-editor: open_help_click');
    this.helpModal.open();
  }

  closeHelp(): void {
    this.onHelpClosed();
    this.helpModal.close();
  }

  onOverlayClicked(): void {
    this.onHelpClosed();
  }

  onHelpClosed(): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'task-editor: close_help_click');
    this.taskEditorService.setIntroductionStatus(false);
    this.taskEditorService.setIntroductionForbidStatus(this.dontShowMessaggeOnStart);
  }
}
