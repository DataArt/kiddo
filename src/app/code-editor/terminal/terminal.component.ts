import { AfterViewChecked, Component, ViewChild } from '@angular/core';
import { TerminalService } from './terminal.service';
import { Observable } from 'rxjs';
import { delay, take, tap } from 'rxjs/operators';
import { CodeEditorService } from '../code-editor-service/code-editor.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { GoogleAnalyticsService } from 'src/app/shared/services';
import { TerminalMessage } from 'src/app/shared/interfaces/terminal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'kiddo-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements AfterViewChecked {

  @ViewChild('perfectScrollbarComponent') perfectScrollbar: PerfectScrollbarComponent;

  content: TerminalMessage[];
  isOpen: Observable<boolean>;
  prefixTooltip = 'TERMINAL.TOOLTIP.';

  constructor(
    private terminal: TerminalService,
    private codeEditorService: CodeEditorService,
    private googleAnalyticsService: GoogleAnalyticsService,
  ) {
    this.content = this.terminal.content;
    this.isOpen = this.terminal.isOpen;
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  toggle(): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'game-player: terminal_toggle_click');

    this.terminal.isOpen.pipe(
      take(1),
      tap(IsOpen => IsOpen ? this.terminal.close() : this.terminal.open()),
      delay(0),
      tap(() => this.codeEditorService.aceEditorInstance.resize())
    ).subscribe();
  }

  clear(e: Event): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'game-player: terminal_clear_click');
    e.stopPropagation();
    this.terminal.clear();
  }

  scrollToBottom(): void {
    this.perfectScrollbar.directiveRef.scrollToBottom();
  }
}
