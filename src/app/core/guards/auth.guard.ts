import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LanguageService } from '../services/language.service';

export const authGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const languageService = inject(LanguageService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  const lang = languageService.currentLang();
  const returnUrl = router.currentNavigation()?.extractedUrl.toString();

  return router.createUrlTree([lang, 'auth', 'signin'], {
    queryParams: returnUrl ? { returnUrl } : undefined
  });
};
