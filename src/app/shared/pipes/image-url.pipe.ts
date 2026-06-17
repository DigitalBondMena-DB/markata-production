import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'imageUrl'
})
export class ImageUrlPipe implements PipeTransform {
  transform(path: string | null | undefined, defaultPlaceholder: string = ''): string {
    if (!path) return defaultPlaceholder;
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${environment.imageBaseUrl}${path}`;
  }
}
