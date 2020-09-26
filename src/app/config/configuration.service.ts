import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { safeLoad as parseYaml } from 'js-yaml';

import { AppConfig, DatabaseConfig, SceneConfigOptions, LanguageConfig } from './config.interface';
import { DatabaseConfigService } from './database-config.service';
import { LanguageConfigService } from './language-config.service';
import { SceneConfig } from '../../app-engine/scene/common/scene-config';
import { SceneConfigService } from './scene-config.service';
import { ScriptRunnerService } from '../../app-engine/script-runner/script-runner.service';
import { AnalyticsConfigService } from './analytics-config.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(
    private http: HttpClient,
    private databaseConfigService: DatabaseConfigService,
    private languageConfigService: LanguageConfigService,
    private sceneConfigService: SceneConfigService,
    private analyticsConfigService: AnalyticsConfigService,
    private scriptRunnerService: ScriptRunnerService
  ) { }

  private sceneConfig: Subject<SceneConfig> = new Subject();
  private appConfig: AppConfig;
  appConfigLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);

  applyAppConfiguration(appConfig: AppConfig): void {
    this.databaseConfigService.setDatabaseConfiguration(appConfig.database);
    this.languageConfigService.setLanguageConfiguration(appConfig.language);
    this.analyticsConfigService.setAndApplyAnalyticsConfiguration(appConfig.analytics);
  }

  async applySceneConfiguration(configOptions: SceneConfigOptions): Promise<void> {
    const processedSceneConfig = await this.sceneConfigService.processSceneConfiguration(configOptions);
    this.scriptRunnerService.initializeScene(processedSceneConfig);
  }

  getDatabaseConfiguration(): DatabaseConfig {
    return this.databaseConfigService.getDatabaseConfiguration();
  }

  getLanguageConfiguration(): LanguageConfig {
    return this.languageConfigService.getLanguageConfiguration();
  }

  async setAppConfig(config: AppConfig): Promise<void> {
    await this.http
      .get(`${environment.assetsPath}/files/defaultAppConfig.json`)
      .toPromise()
      .then(defaultAppConfig => {
        const appConfig = {
          ...defaultAppConfig,
          ...config,
        };

        this.appConfig = appConfig;
        this.applyAppConfiguration(this.appConfig);
      });
  }

  getAppConfig(): AppConfig {
    return this.appConfig;
  }

  setSceneConfig(config: SceneConfig): void {
    this.sceneConfig.next(config);
  }

  getSceneConfig(): Observable<SceneConfig> {
    return this.sceneConfig;
  }

  createConfigChangedObserver(kiddoCustomElement: Element): MutationObserver {
    return new MutationObserver(async mutations => {
      if (mutations.find(item => item.attributeName === 'kiddo-scene-config')) {
        const parsedSceneConfig = parseYaml(kiddoCustomElement.getAttribute('kiddo-scene-config')) as SceneConfig;
        this.setSceneConfig(parsedSceneConfig);
      }

      if (mutations.find(item => item.attributeName === 'kiddo-app-config')) {
        await this.setAppConfig(JSON.parse(kiddoCustomElement.getAttribute('kiddo-app-config')));
        this.appConfigLoaded.next(true);
      }
    });
  }

}
