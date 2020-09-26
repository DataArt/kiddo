import { Component, OnInit, Input, OnChanges } from '@angular/core';
import {CdkStepper} from '@angular/cdk/stepper';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'kiddo-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  providers: [{ provide: CdkStepper, useExisting: StepperComponent }]
})
export class StepperComponent  extends CdkStepper implements OnInit {

  @Input() helpArray: string[];

  ngOnInit(): void {
  }

  onClick(index: number): void {
    this.selectedIndex = index;
  }

}
