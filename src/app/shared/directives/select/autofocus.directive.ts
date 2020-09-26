import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[kiddoAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {

  constructor(private elRef: ElementRef) {
  }

  ngAfterViewInit(): void {
    this.elRef.nativeElement.focus();
  }

}
