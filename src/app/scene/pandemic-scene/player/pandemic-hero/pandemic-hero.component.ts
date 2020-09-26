import { Component, Input } from '@angular/core';

import { Direction } from '../../../../../app-engine/scene/common/entities';
import { Player, GameObjectState } from '../../../../../app-engine/scene/raccoon/entities';

@Component({
  selector: 'kiddo-pandemic-hero',
  templateUrl: './pandemic-hero.component.html',
  styleUrls: ['./pandemic-hero.component.scss'],
})
export class PandemicHeroComponent {
  @Input() player: Player;
  GameObjectState: typeof GameObjectState = GameObjectState;
  Direction: typeof Direction = Direction;
}
