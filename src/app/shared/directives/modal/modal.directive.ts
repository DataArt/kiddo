import { AfterViewInit, Directive, ElementRef, EventEmitter, OnDestroy, Output, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Directive({
  selector: '[kiddoModal]',
  exportAs: 'kiddoModal'
})
export class ModalDirective implements AfterViewInit, OnDestroy {

  @Output() overlayClicked: EventEmitter<void> = new EventEmitter();

  public payload: any;

  private _isOpen = new BehaviorSubject(false);

  private _subscriptions = new Subscription();

  private _element = this.elementRef.nativeElement;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
  }

  ngAfterViewInit(): void {
    this._setModalStyles();
    this._setOverlay();
    this._manageOpenCloseState();
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  isOpen(): Observable<boolean> {
    return this._isOpen;
  }

  open(payload?: any): void {
    this.payload = payload;
    this._isOpen.next(true);
  }

  close(): void {
    this.overlayClicked.emit();
    this._isOpen.next(false);
  }

  private _setModalStyles(): void {
    this.renderer.addClass(this._element, 'app-modal');
  }

  private _setOverlay(): void {
    const overlay = this.renderer.createElement('div');
    this.renderer.addClass(overlay, 'app-modal-overlay');
    const parent = this.renderer.parentNode(this._element);
    const nextSibling = this.renderer.nextSibling(this._element);
    this.renderer.insertBefore(parent, overlay, nextSibling);
    this.renderer.listen(overlay, 'click', () => this.close());
  }

  private _manageOpenCloseState(): void {
    const isOpenSubscription = this._isOpen.subscribe(open => {
      if (open) {
        this.renderer.removeClass(this._element, 'app-modal-closed');
      } else {
        this.renderer.addClass(this._element, 'app-modal-closed');
      }
    });
    this._subscriptions.add(isOpenSubscription);
  }
}
