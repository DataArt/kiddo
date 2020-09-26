import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[kiddoSelectableItem]'
})
export class SelectableItemDirective {
  @Output() justClick = new EventEmitter<void>();
  @Output() shiftClick = new EventEmitter<void>();
  @Output() ctrlClick = new EventEmitter<void>();

  constructor() {
  }

  @HostListener('click', ['$event'])
  onItemClick(event: MouseEvent): void {
    event.preventDefault();
    if (event.ctrlKey) {
      this.ctrlClick.emit();
    } else if (event.shiftKey) {
      this.shiftClick.emit();
    } else {
      this.justClick.emit();
    }
  }
}
