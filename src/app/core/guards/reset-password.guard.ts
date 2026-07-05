import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LanguageService } from '../services/language.service';

export const resetPasswordGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const languageService = inject(LanguageService);

  const token = route.queryParams['token'];
  const email = route.queryParams['email'];

  if (token && email) {
    return true;
  }

  // Redirect to signin page if query parameters are missing
  const lang = languageService.currentLang();
  return router.createUrlTree([lang, 'auth', 'signin']);
};
