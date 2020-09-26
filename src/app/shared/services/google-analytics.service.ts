import { Injectable } from '@angular/core';

// tslint:disable-next-line: ban-types
declare const gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor() { }

  emitEvent(eventCategory: string, eventAction: string, eventLabel: any = null, eventValue: any = null): void {
    if (typeof gtag === 'undefined') {
      return;
    }

    gtag('event', eventAction, {
      event_category: eventCategory,
      event_label: eventLabel,
      value: eventValue,
    });
  }

}
