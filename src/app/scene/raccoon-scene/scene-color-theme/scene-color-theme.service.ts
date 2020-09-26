import { ColorTheme } from './scene-color-theme';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SceneColorThemeService {

  constructor() { }

  setColorTheme(theme: ColorTheme): void {
    // TODO IMPORTANT synchronize this with scene init!!
    if (!theme) return;
    Object.keys(theme.properties).forEach(property => {
      document.documentElement.style.setProperty(
        property,
        theme.properties[property]
      );
    });
  }
}
