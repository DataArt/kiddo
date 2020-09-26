import { Component, Input, OnInit } from '@angular/core';
import { Tile, PassableTile, TileCssClassMap, ImpassableTile, CustomeTile } from '../../../../../app-engine/scene/raccoon/entities';
import { Coords } from '../../../../../app-engine/scene/common/entities';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'kiddo-raccoon-tile-row',
  templateUrl: './raccoon-tile-row.component.html',
  styleUrls: ['./raccoon-tile-row.component.scss']
})
export class RaccoonTileRowComponent implements OnInit {
  @Input() row: Tile[];
  @Input() customTiles: CustomeTile[];
  @Input() playerPosition: Coords;
  @Input() rowIndex: number;
  @Input() sceneIsLabyrinth: boolean;
  env = environment;
  PassableTile: typeof PassableTile = PassableTile;
  ImpassableTile: typeof ImpassableTile = ImpassableTile;
  tileMap: TileCssClassMap = {
    [PassableTile.ROAD]: { cssClass: 'road' },
    [PassableTile.FINAL]: { cssClass: 'finish' },
    [ImpassableTile.GRASS]: { cssClass: 'grass' },
    [ImpassableTile.BUSH]: { cssClass: 'bush' },
  };

  ngOnInit(): void {
    if (this.customTiles != null) {
      this.addCustomTilesToMap(this.customTiles);
    }
  }

  isIncognita(tileIndex: number): boolean {
    return Math.abs(this.playerPosition.x - tileIndex) > 1
      || Math.abs(this.playerPosition.y - this.rowIndex) > 1;
  }

  private addCustomTilesToMap(customTiles: CustomeTile[]): void {
    for (const customTile of customTiles) {
      this.tileMap[customTile.name] = { cssClass: 'custom-tile', imageUrl: customTile.url };
    }
  }

}
