import { ElementRef, Injectable } from '@angular/core';
import { MenuPlacement, MenuIndent } from './dropdown.types';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor() {
  }

  deriveMenuIndent(placement: MenuPlacement, toggle: ElementRef, menu: ElementRef): MenuIndent {
    const { offsetHeight: toggleHeight, offsetWidth: toggleWidth } = toggle.nativeElement;
    const { offsetHeight: listHeight, offsetWidth: listWidth } = menu.nativeElement;

    let topIndent = 0;
    let leftIndent = 0;
    const [primary, secondary] = placement.match(/\w+/g);

    const primaryLookup = {
      top: () => topIndent = -listHeight,
      right: () => leftIndent = toggleWidth,
      bottom: () => topIndent = toggleHeight,
      left: () => leftIndent = -listWidth
    };

    const secondaryLookup = {
      top: () => topIndent = toggleHeight - listHeight,
      right: () => leftIndent = 0,
      bottom: () => topIndent = 0,
      left: () => leftIndent = toggleWidth - listWidth
    };

    primaryLookup[primary]();
    secondaryLookup[secondary]();

    return [leftIndent, topIndent];
  }
}
