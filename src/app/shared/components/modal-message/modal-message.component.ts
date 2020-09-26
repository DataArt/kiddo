import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { GoogleAnalyticsService } from '../../services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'kiddo-modal-message',
  templateUrl: './modal-message.component.html',
  styleUrls: ['./modal-message.component.scss']
})
export class ModalMessageComponent implements OnInit {
  @Output() acceptClick = new EventEmitter();
  @Output() cancelClick = new EventEmitter();
  @Output() resetClick = new EventEmitter();
  @Input() disableAcceptButton: boolean;
  @Input() acceptButtonText: string;
  @Input() enableResetButton: boolean;
  @Input() warning: boolean;

  prefixPath = 'MODAL.';

  constructor(private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit(): void {
  }

  onAcceptClick(): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'modal_window: accept_button_click');
    this.acceptClick.emit();
  }

  onCancelClick(): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'modal_window: cancel_button_click');
    this.cancelClick.emit();
  }

  onResetClick(): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'modal_window: reset_button_click');
    this.resetClick.emit();
  }

}
