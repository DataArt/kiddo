import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { AnalyticsConfig } from './config.interface';

// tslint:disable-next-line: ban-types
declare const gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsConfigService {

  private analyticsConfig: AnalyticsConfig;

  constructor(private router: Router) { }

  setAndApplyAnalyticsConfiguration(analyticsConfig: AnalyticsConfig): void {
    this.analyticsConfig = analyticsConfig;

    if (!this.analyticsConfig.GA_key) {
      return;
    }

    this.appendGAScriptsToDocument(analyticsConfig.GA_key);
    this.subscribeToRouterEvents();
  }

  appendGAScriptsToDocument(gaKey: string): void {
    const gaGlobalTagScript = document.createElement('script');
    gaGlobalTagScript.async = true;
    gaGlobalTagScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaKey}`;
    document.head.appendChild(gaGlobalTagScript);

    const gaConfigScript = document.createElement('script');
    const gaConfigScriptCode = `
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());

      gtag('config', '${gaKey}');
    `;
    try {
      gaConfigScript.appendChild(document.createTextNode(gaConfigScriptCode));
      document.head.appendChild(gaConfigScript);
    } catch (e) {
      gaConfigScript.text = gaConfigScriptCode;
      document.head.appendChild(gaConfigScript);
    }
  }

  subscribeToRouterEvents(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', this.analyticsConfig.GA_key,
          {
            page_path: event.urlAfterRedirects
          }
        );
      }
    });
  }

  getAnalyticsConfiguration(): AnalyticsConfig {
    return this.analyticsConfig;
  }

}
