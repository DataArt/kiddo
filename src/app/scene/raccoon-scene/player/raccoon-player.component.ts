import { Component, Input } from '@angular/core';
import { Player } from '../../../../app-engine/scene/raccoon/entities';

@Component({
  selector: 'kiddo-raccoon-player',
  templateUrl: './raccoon-player.component.html',
  styleUrls: ['./raccoon-player.component.scss'],
})
export class PlayerComponent {
  @Input() player: Player;
}
