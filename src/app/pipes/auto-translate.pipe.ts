import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'autoTranslate',
  pure: false // allows updates when translation completes
})
export class AutoTranslatePipe implements PipeTransform {
  private translatedText: string = '';
  private lastInput: string = '';
  private lastLang: string = '';

  transform(value: string, targetLang: string = 'es'): string {
    if (!value || typeof value !== 'string') {
      return '';
    }

    if (value === this.lastInput && targetLang === this.lastLang) {
      return this.translatedText;
    }

    this.lastInput = value;
    this.lastLang = targetLang;

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(value)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && Array.isArray(data[0])) {
          this.translatedText = data[0].map((item: any) => item[0]).join(" ");
        } else {
          console.warn('Unexpected translation format:', data);
          this.translatedText = value; // fallback
        }
      })
      .catch(err => {
        console.error('Translation error:', err);
        this.translatedText = value; // fallback
      });

    return this.translatedText || value;
  }
}
