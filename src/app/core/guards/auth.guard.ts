import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LanguageService } from '../services/language.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const languageService = inject(LanguageService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  const lang = languageService.currentLang();
  const returnUrl = state.url;

  return router.createUrlTree([lang, 'auth', 'signin'], {
    queryParams: { returnUrl }
  });
};
