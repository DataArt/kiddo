import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskEditorService } from 'src/app/shared/services/task-editor.service';
import { Observable, timer } from 'rxjs';
import { TerminalService } from 'src/app/code-editor/terminal/terminal.service';
import { KiddoInitService } from 'src/app/kiddo-init.service';
import { GoogleAnalyticsService } from 'src/app/shared/services';
import { AceConfigInterface, AceComponent } from 'ngx-ace-wrapper';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'kiddo-initial-code-form',
  templateUrl: './initial-code-form.component.html',
  styleUrls: ['./initial-code-form.component.scss']
})
export class InitialCodeFormComponent implements OnInit {

  constructor(
    private taskEditorService: TaskEditorService,
    private terminalService: TerminalService,
    private kiddoInitService: KiddoInitService,
    private googleAnalyticsService: GoogleAnalyticsService,
  ) { }

  selectedCode: string;
  noConfig: Observable<boolean>;
  loaded: Observable<boolean>;
  aceConfig: AceConfigInterface = {
    wrap: true,
  };
  @ViewChild('aceComponent') aceComponent: AceComponent;


  ngOnInit(): void {
    this.terminalService.clear();
    this.selectedCode = this.taskEditorService.initialCode ? this.taskEditorService.initialCode : '';
    this.noConfig = this.kiddoInitService.noConfig;
    this.loaded = this.kiddoInitService.isLoaded;
  }

  onGenerateButtonClick(): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'task-editor: generate_level_click');
    this.taskEditorService.setInitialCode(this.selectedCode);
  }

  onAceWrapperResized(): void {
    this.aceComponent?.directiveRef.ace().resize();
  }
}
