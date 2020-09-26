import { Component, Input, OnInit } from '@angular/core';
import { greenTheme, purpleTheme } from '../scene-color-theme/scene-color-theme';
import { SceneColorThemeService } from '../scene-color-theme/scene-color-theme.service';
import { Tile } from '../../../../app-engine/scene/raccoon/entities';
import { SceneType } from '../../../../app-engine/scene/common/models/scene-type.enum';
import { Coords } from '../../../../app-engine/scene/common/entities';

@Component({
  selector: 'kiddo-game-field',
  templateUrl: './game-field.component.html',
  styleUrls: ['./game-field.component.scss']
})
export class GameFieldComponent implements OnInit {
  @Input() field: Tile[][];
  @Input() sceneType: SceneType;
  @Input() playerPosition: Coords;
  @Input() sceneIsLabyrinth: boolean;
  public SceneType = SceneType;

  private sceneColorThemes = {
    [SceneType.RACCOON]: greenTheme,
    [SceneType.PANDEMIC]: purpleTheme,
  };

  constructor(private sceneColorThemeService: SceneColorThemeService) {
  }

  ngOnInit(): void {
    this.sceneColorThemeService.setColorTheme(this.sceneColorThemes[this.sceneType]);
  }
}
