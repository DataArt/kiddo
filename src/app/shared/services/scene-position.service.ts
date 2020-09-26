import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScenePositionService {
  public get sceneIsCollapsed(): boolean {
    return this._sceneCollapsed;
  }

  public get scenePositionState(): BehaviorSubject<boolean> {
    return this._positionSwapped;
  }

  private _positionSwapped = new BehaviorSubject(false);

  private _sceneCollapsed = false;

  constructor() {
  }

  setSceneLeft(): void {
    this._positionSwapped.next(true);
  }

  setSceneRight(): void {
    this._positionSwapped.next(false);
  }

  collapseScene(): void {
    this._sceneCollapsed = true;
  }

  openScene(): void {
    this._sceneCollapsed = false;
  }
}
