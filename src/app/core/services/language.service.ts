import { DOCUMENT, inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly _DOCUMENT = inject(DOCUMENT);
  readonly currentLang = signal<string>('en');

  initLang() {
    this.translate.addLangs(['ar', 'en']);
    const browserLang = this.translate.getBrowserLang();
    const defaultLang = browserLang?.match(/en|ar/) ? browserLang : 'en';
    this.setLanguage(defaultLang);
  }

  getBrowserOrSavedLang(): string {
    const browserLang = this.translate.getBrowserLang();
    return browserLang?.match(/en|ar/) ? browserLang : 'en';
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang.set(lang);

    this._DOCUMENT.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    this._DOCUMENT.documentElement.lang = lang;
  }

  t(en: string, ar: string): string {
    return this.currentLang() === 'ar' ? ar : en;
  }
}
