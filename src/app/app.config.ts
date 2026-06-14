import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from "@ngx-translate/core";
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageService } from './core/services/language.service';
import enTranslations from '../../public/assets/i18n/en.json'
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    provideAppInitializer(() => {
      const translate = inject(TranslateService);
      translate.setTranslation('en', enTranslations);
      return translate.use('en');
    }),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json'
      }),
      fallbackLang: 'en',
      lang: 'en'
    })
  ]
};
