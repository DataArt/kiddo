import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameStatisticsService {

  constructor() { }

  convertToSnakeCase(value: string): string {
    return value && value
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      .map(x => x.toLowerCase())
      .join('_');
  }

  deriveStatisticsItemValue(value: string | number | boolean, prefix: string = ''): string {
    if (typeof value === 'string' && value.match(/^[A-Z_]*$/)) {
      return prefix + value;
    } else if (typeof value === 'boolean') {
      return value ? prefix + 'MESSAGE_YES' : prefix + 'MESSAGE_NO';
    } else {
      return value?.toString();
    }
  }
}
