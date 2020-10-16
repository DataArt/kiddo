import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { PandemicGameObjectCssClassImageMap } from 'src/app-engine/scene/pandemic/entities/game-object';

import { GameObjectCssClassImageMap } from '../../../../app-engine/scene/raccoon/entities';


@Directive({
  selector: '[kiddoGameObjectImage]'
})
export class GameObjectImageDirective implements OnInit {
  @Input('kiddoGameObjectImage') cssClassImageMap: GameObjectCssClassImageMap;
  @Input('kiddoGameObjectImage') pandemicCssClassImageMap: PandemicGameObjectCssClassImageMap;

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
