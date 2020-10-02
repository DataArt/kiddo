import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Coords } from 'src/app-engine/scene/common/entities';
import { environment } from 'src/environments/environment';
import { Tile, TileCssClassMap, PassableTile, ImpassableTile, CustomeTile } from '../../../../../app-engine/scene/pandemic/entities';

@Component({
  selector: 'kiddo-pandemic-tile-row',
  templateUrl: './pandemic-tile-row.component.html',
  styleUrls: ['./pandemic-tile-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PandemicTileRowComponent {
  @Input() row: Tile[];
  @Input() customTiles: CustomeTile[];
  @Input() playerPosition: Coords;
  @Input() rowIndex: number;
  @Input() sceneIsLabyrinth: boolean;
  env = environment;
  PassableTile: typeof PassableTile = PassableTile;
  ImpassableTile: typeof ImpassableTile = ImpassableTile;
  tileMap: TileCssClassMap = {
    [PassableTile.ROAD]: {cssClass: 'road'},
    [PassableTile.HOME]: {cssClass: 'home'},
    [PassableTile.SHOP]: {cssClass: 'shop'},
    [ImpassableTile.FENCE]: {cssClass: 'fence'},
    [ImpassableTile.CONE]: {cssClass: 'cone'},
    [ImpassableTile.MALL_UP_LEFT]: {cssClass: 'mall mall-up-left'},
    [ImpassableTile.MALL_UP_RIGHT]: {cssClass: 'mall mall-up-right'},
    [ImpassableTile.MALL_DOWN_LEFT]: {cssClass: 'mall mall-down-left'},
    [ImpassableTile.MALL_DOWN_RIGHT]: {cssClass: 'mall mall-down-right'},
  };
}
