import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideTranslateService, TranslateService } from "@ngx-translate/core";
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { environment } from '@env/environment';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { AuthService } from './core/services/auth.service';
import { SiteService } from './core/services/site.service';
import enTranslations from '../../public/assets/i18n/en.json';
import arTranslations from '../../public/assets/i18n/ar.json';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
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
    provideAppInitializer(() => {
      const siteService = inject(SiteService);
      return siteService.loadSiteSettings();
    }),
    provideTranslateService({
      fallbackLang: 'en'
    }),
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        const src = config.src;
        if (!src) return '';
        if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('assets/') || src.startsWith('/assets/')) {
          return src;
        }

        let finalSrc = src;
        if (src.includes('?')) {
          const parts = src.split('?');
          const baseSrc = parts[0];
          const query = parts[1];
          const params = new URLSearchParams(query);

          if (config.width) {
            if (config.width <= 300 && params.has('thumbnail')) {
              finalSrc = params.get('thumbnail')!;
            } else if (config.width <= 800 && params.has('medium')) {
              finalSrc = params.get('medium')!;
            } else {
              finalSrc = baseSrc;
            }
          } else {
            finalSrc = baseSrc;
          }
        } else if (config.width) {
          const extIndex = src.lastIndexOf('.');
          if (extIndex !== -1 && !src.includes('_thumbnail') && !src.includes('_medium')) {
            const pathWithoutExt = src.substring(0, extIndex);
            const ext = src.substring(extIndex);
            if (config.width <= 300) {
              finalSrc = `${pathWithoutExt}_thumbnail${ext}`;
            } else if (config.width <= 800) {
              finalSrc = `${pathWithoutExt}_medium${ext}`;
            }
          }
        }

        const base = environment.imageBaseUrl.endsWith('/') ? environment.imageBaseUrl : `${environment.imageBaseUrl}/`;
        const path = finalSrc.startsWith('/') ? finalSrc.slice(1) : finalSrc;
        return `${base}${path}`;
      }
    }
  ]
};

