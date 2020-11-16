import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GameObject, GameObjectState } from '../../../../app-engine/scene/raccoon/entities';

@Component({
  selector: 'kiddo-pademic-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class PandemicInventoryComponent {
  @Input() inventory: GameObject[];
  @Input() compulsoryItems: GameObject[];
  assetsPath = environment.assetsPath;

  GameObjectState: typeof GameObjectState = GameObjectState;
}
