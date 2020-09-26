import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

import { Tile } from 'src/app-engine/scene/raccoon/entities';

@Directive({
  selector: '[kiddoGameFieldMaxWidth]'
})
export class GameFieldMaxWidthDirective implements OnInit {
  @Input('kiddoGameFieldMaxWidth') gameField: Tile[][];

  constructor(private elRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.renderer.setStyle(
      this.elRef.nativeElement, 'max-width', this.gameField[0].length / this.gameField.length * 100 + '%'
    );
  }

}
