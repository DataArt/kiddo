import { Component, Input } from '@angular/core';
import { SceneType } from '../../../../app-engine/scene/common/models/scene-type.enum';
import { Player } from '../../../../app-engine/scene/raccoon/entities';

@Component({
  selector: 'kiddo-pandemic-player',
  templateUrl: './pandemic-player.component.html',
  styleUrls: ['./pandemic-player.component.scss'],
})
export class PlayerComponent {
  @Input() player: Player;
  @Input() sceneType: string;
  SceneType: typeof SceneType = SceneType;
}
