import { AfterViewInit, ContentChildren, Directive, ElementRef, QueryList, Renderer2 } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { DropdownState, MenuIndent } from './dropdown.types';
import { DropdownItemDirective } from './dropdown-item.directive';
import { Destroyed } from '../../services/destroyed.service';
import { takeUntil, tap } from 'rxjs/operators';


@Directive({
  selector: '[kiddoDropdownMenu]'
})
export class DropdownMenuDirective implements AfterViewInit {

  @ContentChildren(DropdownItemDirective) items: QueryList<DropdownItemDirective>;

  state = new BehaviorSubject<DropdownState>('closed');

  indent = new ReplaySubject<MenuIndent>();

  constructor(public element: ElementRef, private renderer: Renderer2, private destroyed: Destroyed) {
  }

  ngAfterViewInit(): void {
    this.indent.pipe(
      tap(indent => this.setIndent(indent)),
      takeUntil(this.destroyed)
    ).subscribe();

    this.state.pipe(
      tap((state: DropdownState) => this.setVisibility(state)),
      takeUntil(this.destroyed)
    ).subscribe();
  }

  private setIndent([left, top]: MenuIndent): void {
    this.setStyle('position', 'absolute');
    this.setStyle('top', top + 'px');
    this.setStyle('left', left + 'px');
    this.setStyle('z-index', '4');
  }

  private setVisibility(state: DropdownState): void {
    if (state === 'open') {
      this.setStyle('visibility', 'visible');
    } else {
      this.setStyle('visibility', 'hidden');
    }
  }

  private setStyle(style: string, value: string): void {
    this.renderer.setStyle(this.element.nativeElement, style, value);
  }
}
