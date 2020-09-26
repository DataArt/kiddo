import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { timer } from 'rxjs';

import { SceneTypeFormResult } from 'src/app/shared/interfaces/task-editor';
import { TaskEditorService } from 'src/app/shared/services/task-editor.service';
import { GoogleAnalyticsService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'kiddo-scenetype-form',
  templateUrl: './scenetype-form.component.html',
  styleUrls: ['./scenetype-form.component.scss']
})
export class ScenetypeFormComponent implements OnInit {

  sceneTypeForm: FormGroup;
  @Output() sceneTypeFormSubmit: EventEmitter<void> = new EventEmitter<void>();
  @Output() resetProgress: EventEmitter<void> = new EventEmitter<void>();
  sceneType: string;

  constructor(
    private taskEditorService: TaskEditorService,
    private googleAnalyticsService: GoogleAnalyticsService,
  ) {}

  ngOnInit(): void {
    this.sceneTypeForm = new FormGroup({
      sceneType: new FormControl(
        '',
        Validators.required
        ),
    });
  }

  onSubmit(formValue: SceneTypeFormResult): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'code-editor: next_click');
    if (formValue.sceneType !== this.sceneType && this.sceneType) {
      this.taskEditorService.clearTaskEditor();
      this.resetProgress.emit();
    }
    this.taskEditorService.setSceneType(formValue.sceneType);

    this.sceneTypeFormSubmit.emit();

    this.sceneType = formValue.sceneType;
  }
}
