import { Component, Input } from '@angular/core';
import { GameObject, GameObjectState, GameObjectCssClassImageMap } from '../../../../app-engine/scene/raccoon/entities';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'kiddo-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent {
  @Input() inventory: GameObject[];
  @Input() compulsoryItems: GameObject[];
  assetsPath = environment.assetsPath;

  GameObjectState: typeof GameObjectState = GameObjectState;
}
