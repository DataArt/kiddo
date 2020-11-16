import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GameObject, GameObjectState } from '../../../../../app-engine/scene/raccoon/entities';

@Component({
  selector: 'kiddo-pandemic-game-object',
  templateUrl: './game-object.component.html',
  styleUrls: ['./game-object.component.scss'],
})
export class PandemicGameObjectComponent {
  @Input() gameObject: GameObject;
  GameObjectState: typeof GameObjectState = GameObjectState;
  assetsPath = environment.assetsPath;
}
