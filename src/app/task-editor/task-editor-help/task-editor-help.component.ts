import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { I18nFactoryService } from 'src/app/shared/services';
import { TaskEditorService } from 'src/app/shared/services/task-editor.service';
import { environment } from 'src/environments/environment';
import { helpNames } from '../task-editor-data';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kiddo-task-editor-help',
  templateUrl: './task-editor-help.component.html',
  styleUrls: ['./task-editor-help.component.scss']
})
export class TaskEditorHelpComponent implements OnInit, AfterViewInit {

  helpNames: string[];
  step: number;
  environment = environment;
  markdownListReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  lastLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  helpPrefix = 'TASK_EDITOR.HELP.';

  sceneType = this.taskEditorService.sceneType ? this.taskEditorService.sceneType.toUpperCase() : 'RACCOON';

  constructor(private taskEditorService: TaskEditorService) {}
  @Input() selectedIndex: number;
  showHelpIntroduction: Observable<boolean> ;

  ngOnInit(): void {
    this.step = ++this.selectedIndex;
    this.showHelpIntroduction = this.taskEditorService.getIntroductionStatus();

    this.helpNames = helpNames.map(
      helpName => {
        const stepName = helpName.replace('sceneType', this.sceneType);
        return this.helpPrefix + stepName;
      });
    this.markdownListReady.next(true);
  }

  ngAfterViewInit(): void {
    const el = document.getElementById(`step${this.step}`);
    el?.scrollIntoView({behavior: 'smooth'});
  }
}
