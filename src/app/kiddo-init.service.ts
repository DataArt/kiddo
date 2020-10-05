import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { ConfigurationService } from './config/configuration.service';
import { TerminalService } from './code-editor/terminal/terminal.service';
import { SceneConfigError } from 'src/app-engine/scene/common/errors/game-fail-error';
import { I18nFactoryService } from './shared/services/i18n-factory.service';
import { SceneConfigOptions } from './config/config.interface';
import { environment } from 'src/environments/environment';

interface ConfigError {
  message: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class KiddoInitService {

  isLoaded = new BehaviorSubject<boolean>(false);
  noConfig = new BehaviorSubject<boolean>(false);
  configError = new BehaviorSubject<ConfigError>(null);
  initPrefix = 'INITIALIZATION.';

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
    private terminal: TerminalService,
    private i18n: I18nFactoryService) {
  }

  async initializeKiddo(configOptions: SceneConfigOptions): Promise<void> {
    try {
      this.configError.next(null);
      await this.configurationService.applySceneConfiguration(configOptions);
      this.isLoaded.next(true);
      this.noConfig.next(false);
    } catch (err) {
      this.handleConfigFailure(err);
    }
  }

  async appendIcomoonFontFaceStyle(): Promise<void> {
    const newFontStyleSheet = document.createElement('style');
    await this.http
      .get(`${environment.assetsPath}/files/icomoon-font-face.txt`, { responseType: 'text' })
      .toPromise()
      .then(icomoonFontFace => {
        newFontStyleSheet.textContent = icomoonFontFace.replace('assetsPathToReplace', environment.assetsPath);
      });
    document.head.appendChild(newFontStyleSheet);
  }

  async appendFuturaFontFaceStyle(): Promise<void> {
    const newFontStyleSheet = document.createElement('style');
    await this.http
      .get(`${environment.assetsPath}/files/futura-font-face.txt`, { responseType: 'text' })
      .toPromise()
      .then(futuraFontFace => {
        newFontStyleSheet.textContent = futuraFontFace.replace('assetsPathToReplace', environment.assetsPath);
      });
    document.head.appendChild(newFontStyleSheet);
  }

  private handleConfigFailure(error: Error): void {
    console.log(error)
    this.isLoaded.next(true);
    this.noConfig.next(true);

    const errorType = error instanceof SceneConfigError
      ? 'CONFIG_ERROR'
      : 'JS_ERROR';

    const errorMessage = error instanceof SceneConfigError
      ? this.initPrefix + error.message
      : error.message;

    this.terminal.print(`${this.i18n.translate(this.initPrefix)(errorType)}: ${this.i18n.translate('')(errorMessage)}`);
    this.configError.next({ type: errorType, message: errorMessage });

  }

  resetApp(): void {
    this.isLoaded.next(false);
    this.noConfig.next(false);
  }
}
