import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'languageNative'
})
export class LanguageNativePipe implements PipeTransform {
  private matching = {
    en: 'English',
    de: 'Deutsch',
    fr: 'Français',
    es: 'Español',
    ru: 'Русский',
    ua: 'Українська',
    bg: 'Български',
    pl: 'Polski',
    am: 'Հայերեն',
    ar: 'العربية'
  };

  transform(value: string): string {
    return this.matching[value.toLowerCase()];
  }
}
