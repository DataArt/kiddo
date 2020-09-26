import { Component, EventEmitter, Output } from '@angular/core';
import { SceneModelService } from '../../../app-engine/scene/scene-model.service';
import { GoogleAnalyticsService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'kiddo-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {

  @Output() closeModal = new EventEmitter<void>();

  private sceneModelService: SceneModelService;

  constructor(private googleAnalyticsService: GoogleAnalyticsService) {
    this.sceneModelService = new SceneModelService();
  }

  onCloseClick(): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'game-player: task_close_click');
    this.closeModal.emit();
  }

  getTaskDescription(): string {
    const taskDescription = this.sceneModelService.taskDescription;
    return taskDescription || 'No task description found!';
  }
}
