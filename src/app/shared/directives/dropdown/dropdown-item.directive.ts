import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[kiddoDropdownItem]'
})
export class DropdownItemDirective implements AfterViewInit {

  @Output() itemClickEvent = new EventEmitter<void>();

  constructor(public element: ElementRef,
              private renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    this.renderer.setStyle(this.element.nativeElement, 'cursor', 'pointer');
  }

  @HostListener('click')
  onClick(): void {
    this.itemClickEvent.emit();
  }
}
