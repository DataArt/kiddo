import { Component, Input, OnInit } from '@angular/core';
import { purpleTheme } from '../scene-color-theme/scene-color-theme';
import { SceneColorThemeService } from '../scene-color-theme/scene-color-theme.service';
import { CustomeTile, Tile } from '../../../../app-engine/scene/raccoon/entities';
import { Coords } from '../../../../app-engine/scene/common/entities';

@Component({
  selector: 'kiddo-pandemic-game-field',
  templateUrl: './game-field.component.html',
  styleUrls: ['./game-field.component.scss']
})
export class PandemicGameFieldComponent implements OnInit {
  @Input() field: Tile[][];
  @Input() customTiles: CustomeTile[];
  @Input() playerPosition: Coords;
  @Input() sceneIsLabyrinth: boolean;

  constructor(private sceneColorThemeService: SceneColorThemeService) {
  }

  ngOnInit(): void {
    this.sceneColorThemeService.setColorTheme(purpleTheme);
  }
}
