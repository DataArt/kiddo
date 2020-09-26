import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'snakeToKebabCase',
  pure: true,
})
export class SnakeToKebabCasePipe implements PipeTransform {
  transform(value: string): string {
    const regex = /_/g;
    return value.replace(regex, '-');
  }
}
