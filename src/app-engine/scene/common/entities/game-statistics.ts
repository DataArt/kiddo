export interface GameStatistics {
  gameFinished: boolean;
  levelPassed: boolean;
  failReason?: string;
  failRowNumber?: number;
}

export interface TileGameStatistics extends GameStatistics {
  cellsPassed?: number;
}

export interface RaccoonGameStatistics extends TileGameStatistics {
  compulsoryObjectsPicked?: number;
  compulsoryObjectsTotalAmount?: number;
}

export interface PandemicGameStatistics extends TileGameStatistics {
  compulsoryObjectsPicked?: number;
  compulsoryObjectsTotalAmount?: number;
  maskIsOn?: boolean;
  handsWashed?: boolean;
  productsPicked?: boolean;
}

export interface StatisticsItem {
  name: string;
  value: string;
}
