import { inject } from '@angular/core';
import { Routes, Router, CanActivateFn } from '@angular/router';
import { LanguageService } from './core/services/language.service';

export const langGuard: CanActivateFn = (route) => {
  const lang = route.paramMap.get('lang');
  const languageService = inject(LanguageService);
  const router = inject(Router);

  if (lang === 'en' || lang === 'ar') {
    languageService.setLanguage(lang);
    return true;
  }

  // If invalid lang parameter, redirect to default browser/saved language
  const defaultLang = languageService.getBrowserOrSavedLang();
  return router.createUrlTree([defaultLang, 'home']);
};

export const routes: Routes = [
  {
    path: ':lang',
    canActivate: [langGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./featurs/home/home.component').then(m => m.HomeComponent)
      }
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: () => {
      const languageService = inject(LanguageService);
      const defaultLang = languageService.getBrowserOrSavedLang();
      return `${defaultLang}/home`;
    }
  },
  {
    path: '**',
    redirectTo: () => {
      const languageService = inject(LanguageService);
      const defaultLang = languageService.getBrowserOrSavedLang();
      return `${defaultLang}/home`;
    }
  }
];
