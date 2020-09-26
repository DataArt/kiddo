import { Component, Input } from '@angular/core';
import { ConsoleVariable } from '../../../../app-engine/scene/common/entities';
import { GoogleAnalyticsService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'kiddo-console-toolbar',
  templateUrl: './console-toolbar.component.html',
  styleUrls: ['./console-toolbar.component.scss'],
})
export class ConsoleToolbarComponent {
  @Input() tabs: string[];
  @Input() variables: ConsoleVariable[];
  activeTab = 0;

  constructor(private googleAnalyticsService: GoogleAnalyticsService) { }

  setActiveTab(tabNumber: number): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.tabClick, 'game-player console: change_tab_click');
    this.activeTab = tabNumber;
  }
}
