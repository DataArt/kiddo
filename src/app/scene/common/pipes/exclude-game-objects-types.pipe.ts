import { Pipe, PipeTransform } from '@angular/core';
import { GameObject, GameObjectType } from '../../../../app-engine/scene/raccoon/entities';

@Pipe({
  name: 'excludeGameObjectsTypes',
  pure: true,
})
export class ExcludeGameObjectsTypesPipe implements PipeTransform {
  transform(gameObjectsList: GameObject[], excludedTypes: GameObjectType[]): GameObject[] {
    return gameObjectsList.filter(gameObject => !excludedTypes.includes(gameObject.type));
  }
}
