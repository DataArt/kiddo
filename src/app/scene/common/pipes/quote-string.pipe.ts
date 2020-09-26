import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quoteString',
  pure: true,
})
export class QuoteStringPipe implements PipeTransform {
  transform(value: string | number): string | number {
    return typeof value === 'string' ? `"${value}"` : value;
  }
}
