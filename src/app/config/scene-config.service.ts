import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { safeLoad as parseYaml } from 'js-yaml';

import { SceneConfig } from '../../app-engine/scene/common/scene-config';
import { environment } from 'src/environments/environment';
import { SceneConfigOptions } from './config.interface';

@Injectable({
  providedIn: 'root'
})
export class SceneConfigService {

  constructor(private http: HttpClient) { }

  async processSceneConfiguration(configOptions: SceneConfigOptions): Promise<SceneConfig> {
    // if given config is valid, just return it
    if (configOptions.sceneConfig != null && isSceneConfig(configOptions.sceneConfig)) {
      return configOptions.sceneConfig;
    }
    // else assume that config stores a URL path to the YAML file
    if (configOptions.sceneConfig != null) {
      let sceneConfigUrl: URL;
      try {
        sceneConfigUrl = new URL(configOptions.sceneConfig as string);
      } catch (error) {
        sceneConfigUrl = new URL(configOptions.sceneConfig as string, window.location.href);
      }
      const configFromUrl = await this.getSceneConfigFromUrl(sceneConfigUrl.href);
      if (isSceneConfig(configFromUrl)) {
        return configFromUrl;
      }
    }
    // if no config, then try to find it in the local storage
    const configFromLocalStorage = this.getSceneConfigFromLocalStorage(configOptions.localStorageKey);
    if (isSceneConfig(configFromLocalStorage)) {
      return configFromLocalStorage;
    } else {
      throw new Error('Could not find scene config');
    }
  }

  private async getSceneConfigFromUrl(sceneConfigUrl: string): Promise<SceneConfig> {
    const configFromUrl = await this.http
      .get(sceneConfigUrl, { responseType: 'text' })
      .toPromise();

    const parsedConfig: SceneConfig = parseYaml(configFromUrl) as SceneConfig;
    if (isSceneConfig(parsedConfig)) {
      return parsedConfig;
    }
  }

  private getSceneConfigFromLocalStorage(localStorageKey?: string): SceneConfig {
    const key = localStorageKey || environment.taskFromLocalStorageKey;
    const configFromLocalStorage = localStorage.getItem(key);
    const parsedConfig = parseYaml(configFromLocalStorage) as SceneConfig;
    if (isSceneConfig(parsedConfig)) {
      return parsedConfig;
    }
  }

  private getConfigPathFromUrl(): string {
    const pathname = new URL(window.location.href).pathname.slice(1);
    return pathname || 'raccoon/test';
  }

}

// TODO we should decide on which fields are required and check for them here (not just sceneType obviously)
function isSceneConfig(value: any): value is SceneConfig {
  return value?.sceneType !== undefined;
}
