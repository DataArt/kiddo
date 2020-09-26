import { Injectable } from '@angular/core';
import { LanguageConfig } from './config.interface';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageConfigService {

  private languageConfig: LanguageConfig;
  private availableLanguages = ['en', 'ru'];

  constructor(private translateService: TranslateService) {
  }

  getLanguageConfiguration(): LanguageConfig {
    return this.languageConfig;
  }

  setLanguageConfiguration(languageConfig: LanguageConfig): void {
    this.languageConfig = languageConfig;

    this.translateService.addLangs(this.availableLanguages);

    const savedLang = localStorage.getItem('kiddoLanguage');
    const browserLang = this.translateService.getBrowserLang();
    const defaultLang = this.languageConfig.default;

    if (this.languageConfig.useOnly) {
      this.translateService.setDefaultLang(this.languageConfig.useOnly);
      this.translateService.use(this.languageConfig.useOnly);
      return;
    }

    if (savedLang && this.translateService.getLangs().includes(savedLang)) {
      this.translateService.use(savedLang);
    } else if (this.languageConfig.useBrowserLangAsDefault && this.translateService.getLangs().includes(browserLang)) {
      this.translateService.setDefaultLang(browserLang);
      this.translateService.use(browserLang);
    } else if (defaultLang && this.translateService.getLangs().includes(defaultLang)) {
      this.translateService.setDefaultLang(defaultLang);
      this.translateService.use(defaultLang);
    } else {
      this.translateService.setDefaultLang('en');
      this.translateService.use('en');
    }
  }

}
