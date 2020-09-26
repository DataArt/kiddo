import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Destroyed extends Subject<null> implements OnDestroy {
  ngOnDestroy(): void {
    this.next();
    this.complete();
  }
}
