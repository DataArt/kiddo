import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { GameObject, GameObjectState } from '../../../../app-engine/scene/raccoon/entities';

@Component({
  selector: 'kiddo-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryComponent {
  @Input() inventory: GameObject[];
  @Input() compulsoryItems: GameObject[];

  GameObjectState: typeof GameObjectState = GameObjectState;
}
