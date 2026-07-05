import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userNameChar',
})
export class UserNameCharPipe implements PipeTransform {
  transform(value: string | undefined, maxChars: number = 2): string {
    if (!value) return '';

    return `${value.slice(0, maxChars)}`.toUpperCase();
  }
}
