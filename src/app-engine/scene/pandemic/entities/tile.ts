export enum PassableTile {
  ROAD = 'RO',
  HOME = 'HO',
  SHOP = 'SH',
  FINAL = 'FI',
}

export enum ImpassableTile {
  MALL_UP_LEFT = 'L1',
  MALL_UP_RIGHT = 'L2',
  MALL_DOWN_LEFT = 'L3',
  MALL_DOWN_RIGHT = 'L4',
  FENCE = 'FE',
  CONE = 'CO',
}

export type Tile = PassableTile | ImpassableTile;

export interface TileCssClassMap {
  [tileName: string]: { cssClass?: string, imageUrl?: string };
}
