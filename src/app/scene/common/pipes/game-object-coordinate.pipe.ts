import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'coordinateInPercents',
  pure: true,
})
export class GameObjectCoordinatePipe implements PipeTransform {
  transform(gameObjectCoordinate: number, gameFieldCellDimension: number): string {
    return gameObjectCoordinate * gameFieldCellDimension + '%';
  }
}
