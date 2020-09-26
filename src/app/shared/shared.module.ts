import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ModalMessageComponent } from './components/modal-message/modal-message.component';
import { ModalDirective } from './directives/modal/modal.directive';
import { HttpClientModule } from '@angular/common/http';
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule
} from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { StepperComponent } from './components/stepper/stepper.component';
import {CdkStepperModule} from '@angular/cdk/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    ModalMessageComponent,
    ModalDirective,
    StepperComponent,
    LoadingSpinnerComponent
  ],
  exports: [
    CommonModule,
    ModalMessageComponent,
    ModalDirective,
    HttpClientModule,
    TranslateModule,
    PerfectScrollbarModule,
    StepperComponent,
    CdkStepperModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent
  ],
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    HttpClientModule,
    TranslateModule,
    CdkStepperModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    DatePipe,
  ],
})
export class SharedModule { }
