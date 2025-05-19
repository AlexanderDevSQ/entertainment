import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro',
})
export class FiltroPipe implements PipeTransform {

  transform(value: string, showFullText: boolean): string {
    if (!value) return '';

    if (showFullText) {
      return value;
    }
    const maxLength = 150;

    const words = value.split(' ');

    let truncatedText = '';
    for (let i = 0; i < words.length; i++) {
      if ((truncatedText + words[i]).length > maxLength) {
        break;
      }

      truncatedText += words[i] + ' ';
    }

    return truncatedText.trim() + '...';
  }
}
