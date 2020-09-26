import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'propertyFilter'
})
export class PropertyFilterPipe implements PipeTransform {
  transform(objectList: any[], property: string, value: string | boolean | number): any[] {
    return objectList
      ? objectList.filter(item => item[property] === value)
      : objectList;
  }
}
