import { Component, Input } from '@angular/core';

import { GameObject } from '../../../../app-engine/scene/raccoon/entities';
import { GameFieldCellSize } from '../../common/interfaces/game-field-cell-size';

@Component({
  selector: 'kiddo-game-objects',
  templateUrl: './game-objects.component.html',
  styleUrls: ['./game-objects.component.scss'],
})
export class GameObjectsComponent {
  @Input() gameObjects: GameObject[];
  @Input() itemSize: GameFieldCellSize;
}
