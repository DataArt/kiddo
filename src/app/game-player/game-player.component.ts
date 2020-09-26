import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { GoogleAnalyticsService, ScenePositionService } from '../shared/services';
import { Observable } from 'rxjs';
import { KiddoInitService } from '../kiddo-init.service';
import { ModalDirective } from '../shared/directives/modal/modal.directive';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'kiddo-game-player',
  templateUrl: './game-player.component.html',
  styleUrls: ['./game-player.component.scss']
})
export class GamePlayerComponent implements OnInit, AfterViewInit  {
  assetsPath = environment.assetsPath;
  scenePositionState: Observable<boolean>;

  @ViewChild('noConfigMessage') tpl: ModalDirective;

  get sceneIsCollapsed(): boolean {
    return this.scenePositionService.sceneIsCollapsed;
  }

  noConfig = this.kiddoInitService.noConfig;
  isLoaded = this.kiddoInitService.isLoaded;
  configError = this.kiddoInitService.configError;

  constructor(
    private googleAnalyticsService: GoogleAnalyticsService,
    private scenePositionService: ScenePositionService,
    private kiddoInitService: KiddoInitService,
  ) {
  }

  ngOnInit(): void {
    this.scenePositionState = this.scenePositionService.scenePositionState;
  }

  ngAfterViewInit(): void {
    this.configError.subscribe((res) => {
      if (res) {
        this.tpl.open();
      }
    });
  }

  onToggleSceneClick(): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'game-player: toggle_scene_collapse_click');
    this.sceneIsCollapsed ? this.scenePositionService.openScene() : this.scenePositionService.collapseScene();
  }

  onModalCloseClick(): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'game-player: close_modal_click');
    this.tpl.close();
  }
}
