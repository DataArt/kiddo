import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[kiddoDropdownToggle]'
})
export class DropdownToggleDirective implements AfterViewInit {

  @Output() toggleEvent = new EventEmitter<void>();

  constructor(public element: ElementRef, private renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    this.renderer.setStyle(this.element.nativeElement, 'cursor', 'pointer');
  }

  @HostListener('click')
  onClick(): void {
    this.toggleEvent.emit();
  }
}
