import { Pipe, PipeTransform } from '@angular/core';
import { Tile } from 'src/app-engine/scene/pandemic/entities';

import { GameFieldCellSize } from '../../common/interfaces/game-field-cell-size';

@Pipe({
  name: 'pandemicGameFieldCellSize',
  pure: true,
})
export class PandemicGameObjectCellSizePipe implements PipeTransform {
  transform(gameField: Tile[][]): GameFieldCellSize {
    return {
      width: 100 / gameField[0]?.length,
      height: 100 / gameField.length
    };
  }
}
