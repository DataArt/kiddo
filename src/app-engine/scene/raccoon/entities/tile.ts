export enum PassableTile {
  ROAD = 'RO',
  FINAL = 'FI',
  HOME = 'HOME',
}

export enum ImpassableTile {
  BUSH = 'BU',
  GRASS = 'GR',
}

export type Tile = PassableTile | ImpassableTile;

export interface TileCssClassMap {
  [tileName: string]: { cssClass?: string, imageUrl?: string };
}
