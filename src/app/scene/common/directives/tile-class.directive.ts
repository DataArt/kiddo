import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Tile, TileCssClassMap } from '../../../../app-engine/scene/raccoon/entities';

@Directive({
  selector: '[kiddoTileClass]'
})
export class TileClassDirective implements OnInit {
  @Input('kiddoTileClass') tileClass: Tile;
  @Input() tileMap: TileCssClassMap;
  @Input() tileClassPrefix = '';

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    if (!this.tileMap[this.tileClass]) {
      return;
    }

    const { cssClass: tileClass, imageUrl: tileImage } = this.tileMap[this.tileClass];
    this.el.nativeElement.classList.add(`${this.tileClassPrefix}${tileClass}`);
    if (tileImage) {
      this.el.nativeElement.setAttribute('style', `background-image: url('${tileImage}')`);
    }
  }

}
