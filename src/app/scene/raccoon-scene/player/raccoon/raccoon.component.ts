import { Component, Input } from '@angular/core';

import { Direction } from '../../../../../app-engine/scene/common/entities';
import { Player, GameObjectState } from '../../../../../app-engine/scene/raccoon/entities';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'kiddo-raccoon',
  templateUrl: './raccoon.component.html',
  styleUrls: ['./raccoon.component.scss'],
})
export class RaccoonComponent {
  @Input() player: Player;
  assetsPath = environment.assetsPath;
  GameObjectState: typeof GameObjectState = GameObjectState;
  Direction: typeof Direction = Direction;
}
