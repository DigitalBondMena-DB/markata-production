import { DOCUMENT, inject, Service, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Service()
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly _DOCUMENT = inject(DOCUMENT);
  readonly currentLang = signal<string>(this.getInitialLang());

  private getInitialLang(): string {
    try {
      const pathname = this._DOCUMENT.location?.pathname || '';
      const segments = pathname.split('/').filter(Boolean);
      const firstSegment = segments[0];
      if (firstSegment === 'ar' || firstSegment === 'en') {
        return firstSegment;
      }
    } catch (e) {
      // Graceful fallback for non-browser/non-standard environments
    }
    return this.getBrowserOrSavedLang();
  }

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
