
import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { Observable } from 'rxjs';
import { safeLoad as parseYaml } from 'js-yaml';

import { ConfigurationService } from './config/configuration.service';
import { SceneConfig } from 'src/app-engine/scene/common/scene-config';
import { KiddoInitService } from './kiddo-init.service';


@Component({
  selector: 'kiddo-component',
  templateUrl: './kiddo.component.html',
  styleUrls: ['./kiddo.component.scss'],
})
export class KiddoComponent implements OnInit, OnDestroy {

  private sceneConfigChangeObserver: MutationObserver;
  appConfigLoaded: Observable<boolean> = this.configService.appConfigLoaded;

  constructor(
    private el: ElementRef,
    private configService: ConfigurationService,
    private kiddoInitService: KiddoInitService,
    private router: Router
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.configService.getSceneConfig().subscribe(async (config: SceneConfig) => {
      await this.kiddoInitService.initializeKiddo({
        sceneConfig: config,
        localStorageKey: this.el.nativeElement.getAttribute('local-storage-key'),
      });
    });

    this.sceneConfigChangeObserver = this.configService.createConfigChangedObserver(this.el.nativeElement);
    this.sceneConfigChangeObserver.observe(this.el.nativeElement, { attributes: true });

    this.router.events.subscribe((data) => {
      if (data instanceof RoutesRecognized && data.state.root.firstChild.data.title === 'player') {
        this.configService.setSceneConfig(parseYaml(this.el.nativeElement.getAttribute('kiddo-scene-config')) as SceneConfig);
      }
    });

    this.kiddoInitService.appendIcomoonFontFaceStyle();
    this.kiddoInitService.appendFuturaFontFaceStyle();

    await this.configService.setAppConfig(JSON.parse(this.el.nativeElement.getAttribute('kiddo-app-config')));
    this.configService.appConfigLoaded.next(true);
  }

  ngOnDestroy(): void {
    this.sceneConfigChangeObserver.disconnect();
  }

}
