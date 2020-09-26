import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Tile, TileCssClassMap, PassableTile, ImpassableTile } from '../../../../../app-engine/scene/pandemic/entities';

@Component({
  selector: 'kiddo-pandemic-tile-row',
  templateUrl: './pandemic-tile-row.component.html',
  styleUrls: ['./pandemic-tile-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PandemicTileRowComponent {
  @Input() row: Tile[];
  tileMap: TileCssClassMap = {
    [PassableTile.ROAD]: 'road',
    [PassableTile.HOME]: 'home',
    [PassableTile.SHOP]: 'shop',
    [ImpassableTile.FENCE]: 'fence',
    [ImpassableTile.CONE]: 'cone',
    [ImpassableTile.MALL_UP_LEFT]: 'mall mall-up-left',
    [ImpassableTile.MALL_UP_RIGHT]: 'mall mall-up-right',
    [ImpassableTile.MALL_DOWN_LEFT]: 'mall mall-down-left',
    [ImpassableTile.MALL_DOWN_RIGHT]: 'mall mall-down-right',
  };
}
