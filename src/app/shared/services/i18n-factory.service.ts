import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class I18nFactoryService {

  constructor(
    private translateService: TranslateService
  ) { }

  private timestamp = Date.now();

  translate(prefix: string): (key: string, params?: any) => string {
    return (key, params?) => this.translateService.instant(prefix + key, params) as string;
  }

  public translateAsync(prefix: string): (key: string, params?: any) => Promise<string> {
    return async (key, params?) => await this.translateService.get(prefix + key, params).toPromise<string>();
  }

  getTimestamp(): number {
    return this.timestamp;
  }
}
