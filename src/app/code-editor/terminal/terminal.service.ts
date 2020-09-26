import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TerminalMessage } from 'src/app/shared/interfaces/terminal';

@Injectable({
  providedIn: 'root'
})
export class TerminalService {

  readonly content: TerminalMessage[] = [];

  get isOpen(): Observable<boolean> {
    return this._isOpen.asObservable();
  }

  private _isOpen = new BehaviorSubject(true);

  constructor(private datePipe: DatePipe) {
  }

  open(): void {
    this._isOpen.next(true);
  }

  close(): void {
    this._isOpen.next(false);
  }

  print(text: string): void {
    const line = {time: `[${this.datePipe.transform(Date.now(), 'hh:mm:ss')}]`, text};
    this.content.push(line);
  }

  clear(): void {
    this.content.length = 0;
  }
}
