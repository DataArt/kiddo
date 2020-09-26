import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[kiddoSnackbar]',
  exportAs: 'kiddoSnackbar'
})
export class SnackbarDirective implements AfterViewInit {

  private _element = this.elRef.nativeElement;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    this.renderer.addClass(this._element, 'kiddo-snackbar');
  }

  open(): void {
    this.renderer.addClass(this._element, 'kiddo-snackbar--visible');
    setTimeout(() => this.close(), 3000);
  }

  close(): void {
    this.renderer.removeClass(this._element, 'kiddo-snackbar--visible');
  }
}
