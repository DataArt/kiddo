import {
  AfterViewInit,
  ContentChild,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  Renderer2
} from '@angular/core';
import { MenuPlacement } from './dropdown.types';
import { DropdownToggleDirective } from './dropdown-toggle.directive';
import { DropdownMenuDirective } from './dropdown-menu.directive';
import { DropdownService } from './dropdown.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[kiddoDropdown]',
  exportAs: 'kiddoDropdown'
})
export class DropdownDirective implements AfterViewInit, OnDestroy {

  @Input() placement: MenuPlacement;

  @ContentChild(DropdownToggleDirective) dropdownToggle: DropdownToggleDirective;
  @ContentChild(DropdownMenuDirective) dropdownMenu: DropdownMenuDirective;

  private readonly subscriptions = new Subscription();

  constructor(private element: ElementRef,
              private stateService: DropdownService,
              private renderer: Renderer2) {
  }

  ngAfterViewInit(): void {

    this.renderer.setStyle(this.element.nativeElement, 'position', 'relative');

    this.setMenuIndent();

    const toggleSubscription = this.dropdownToggle.toggleEvent.subscribe(() => this.toggle());
    this.subscriptions.add(toggleSubscription);

    this.dropdownMenu.items.forEach(item => {
      const itemClickSubscription = item.itemClickEvent.subscribe(() => this.close());
      this.subscriptions.add(itemClickSubscription);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggle(): void {
    this.setMenuIndent();
    this.dropdownMenu.state.pipe(take(1)).subscribe(currentState => {
      const nextState = currentState === 'open' ? 'closed' : 'open';
      this.dropdownMenu.state.next(nextState);
    });
  }

  open(): void {
    this.setMenuIndent();
    this.dropdownMenu.state.next('open');
  }

  close(): void {
    this.dropdownMenu.state.next('closed');
  }

  @HostListener('document:click', ['$event.target'])
  onOutsideClick(target: EventTarget): void {
    this.dropdownMenu.state.pipe(take(1)).subscribe(state => {
      if (state === 'closed') return;
      const clickedOnMenu = this.dropdownMenu.element.nativeElement.contains(target);
      const clickedOnToggle = this.dropdownToggle.element.nativeElement.contains(target);
      const clickedOutsideDropdown = !(clickedOnMenu || clickedOnToggle);
      if (clickedOutsideDropdown) this.close();
    });
  }

  private setMenuIndent(): void {
    const calculatedIndent = this.stateService.deriveMenuIndent(this.placement, this.dropdownToggle.element, this.dropdownMenu.element);
    this.dropdownMenu.indent.next(calculatedIndent);
  }
}
