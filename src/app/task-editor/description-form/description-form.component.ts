import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TaskEditorService } from 'src/app/shared/services/task-editor.service';
import { TaskDescriptionResult } from 'src/app/shared/interfaces/task-editor';

@Component({
  selector: 'kiddo-description-form',
  templateUrl: './description-form.component.html',
  styleUrls: ['./description-form.component.scss']
})
export class DescriptionFormComponent implements OnInit {

  taskDescriptionForm: FormGroup;
  @Output() descriptionFormSubmit: EventEmitter<void> = new EventEmitter<void>();

  constructor(private taskEditorService: TaskEditorService) {}

  ngOnInit(): void {
    this.taskDescriptionForm = new FormGroup({
      taskDescription: new FormControl(this.taskEditorService.taskDescription ? this.taskEditorService.taskDescription : '')
    });
  }

  onSubmit(formValue: TaskDescriptionResult): void {
    this.descriptionFormSubmit.emit();
    this.taskEditorService.setTaskDescription(formValue.taskDescription);
  }
}
