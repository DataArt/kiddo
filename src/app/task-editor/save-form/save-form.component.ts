
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskEditorService } from 'src/app/shared/services/task-editor.service';
import { FileExportService } from 'src/app/shared/services/file-export.service';
import { GoogleAnalyticsService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'kiddo-save-form',
  templateUrl: './save-form.component.html',
  styleUrls: ['./save-form.component.scss']
})
export class SaveFormComponent implements OnInit, OnDestroy {
  outputCode: string;
  codeCopied: boolean;
  outputCodeSubscription: Subscription;

  constructor(
    private taskEditorService: TaskEditorService,
    private fileExportService: FileExportService,
    private googleAnalyticsService: GoogleAnalyticsService,
    ) { }

  ngOnInit(): void {
    this.outputCodeSubscription = this.taskEditorService.outputCode.subscribe((code) => {
      this.outputCode = code;
    });
  }

  onSaveAsFileClick(data: string): void {
    this.fileExportService.exportAsJsonFile(data);
  }

  onSaveAsYamlFileClick(data: string): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'task-editor: save_as_yaml_file_click');
    this.fileExportService.exportAsYamlFile(data);
  }

  setCodeCopied(): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'task-editor: copy_code_click');
    this.codeCopied = true;
  }

  ngOnDestroy(): void {
    this.outputCodeSubscription.unsubscribe();
  }
}
