import { Component, Input } from '@angular/core';
import { GameObject, GameObjectState, GameObjectCssClassImageMap } from '../../../../../app-engine/scene/raccoon/entities';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'kiddo-game-object',
  templateUrl: './game-object.component.html',
  styleUrls: ['./game-object.component.scss'],
})
export class GameObjectComponent {

  @Input() gameObject: GameObject;
  GameObjectState: typeof GameObjectState = GameObjectState;
  assetsPath = environment.assetsPath;
}
