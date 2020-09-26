import { Directive, ElementRef, Input, OnInit } from '@angular/core';

import { GameObjectCssClassImageMap } from '../../../../app-engine/scene/raccoon/entities';

@Directive({
  selector: '[kiddoGameObjectImage]'
})
export class GameObjectImageDirective implements OnInit {
  @Input('kiddoGameObjectImage') cssClassImageMap: GameObjectCssClassImageMap;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    if (!this.cssClassImageMap) {
      return;
    }

    for (const [cssClass, imagePath] of Object.entries(this.cssClassImageMap)) {
      if (this.el.nativeElement.classList.contains(cssClass)) {
        this.el.nativeElement.setAttribute('style', `background-image: url('${imagePath}')`);
      }
    }
  }

}
