import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideTranslateService, TranslateService } from "@ngx-translate/core";
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/guards/auth.interceptor';
import { errorInterceptor } from './core/guards/error.interceptor';
import { AuthService } from './core/services/auth.service';
import enTranslations from '../../public/assets/i18n/en.json';
import arTranslations from '../../public/assets/i18n/ar.json';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideAppInitializer(() => {
      const translate = inject(TranslateService);
      translate.setTranslation('en', enTranslations);
      translate.setTranslation('ar', arTranslations);
      return translate.use('en');
    }),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.checkAuth();
    }),
    provideTranslateService({
      fallbackLang: 'en'
    })
  ]
};

