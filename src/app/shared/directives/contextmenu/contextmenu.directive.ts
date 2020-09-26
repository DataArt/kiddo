import { AfterViewInit, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import { ContextmenuPosition, ContextmenuState } from './contextmenu.types';

@Directive({
  selector: '[kiddoContextmenu]',
  exportAs: 'kiddoContextmenu'
})
export class ContextmenuDirective implements AfterViewInit {
  private position = new ReplaySubject<ContextmenuPosition>();

  private state = new BehaviorSubject<ContextmenuState>('closed');

  private readonly _subscriptions = new Subscription();

  constructor(private renderer: Renderer2, private elRef: ElementRef) {
  }

  ngAfterViewInit(): void {
    this.setStyle('position', 'absolute');
    this.setStyle('z-index', '99999');

    const stateSubscription = this.state?.subscribe(state => this.setVisibility(state));
    this._subscriptions.add(stateSubscription);

    const positionSubscription = this.position.subscribe(position => this.setPosition(position));
    this._subscriptions.add(positionSubscription);
  }

  open(position: ContextmenuPosition): void {
    this.setPosition(position);
    this.state.next('open');
  }

  close(): void {
    this.state.next('closed');
  }

  @HostListener('document:click', ['$event.target'])
  private onOutsideClick(target: EventTarget): void {
    if (this.elRef.nativeElement.contains(target)) return;
    this.close();
  }

  @HostListener('document:contextmenu', ['$event.target'])
  private onOutsideRightClick(target: EventTarget): void {
    if (this.elRef.nativeElement.parentNode.contains(target) && target !== this.elRef.nativeElement) return;
    this.close();
  }

  private setPosition([left, top]: ContextmenuPosition): void {
    this.setStyle('top', top + 1 + 'px');
    this.setStyle('left', left + 1 + 'px');
  }

  private setVisibility(state: ContextmenuState): void {
    if (state === 'open') {
      this.setStyle('visibility', 'visible');
    } else {
      this.setStyle('visibility', 'hidden');
    }
  }

  private setStyle(style: string, value: string): void {
    this.renderer.setStyle(this.elRef.nativeElement, style, value);
  }
}
