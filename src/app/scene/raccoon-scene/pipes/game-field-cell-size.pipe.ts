import { Pipe, PipeTransform } from '@angular/core';

import { Tile } from '../../../../app-engine/scene/raccoon/entities';
import { GameFieldCellSize } from '../../common/interfaces/game-field-cell-size';

@Pipe({
  name: 'gameFieldCellSize',
  pure: true,
})
export class GameObjectCellSizePipe implements PipeTransform {
  transform(gameField: Tile[][]): GameFieldCellSize {
    return {
      width: 100 / gameField[0]?.length,
      height: 100 / gameField.length
    };
  }
}
