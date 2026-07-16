import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ContactService } from '../services/contact.service';
import { LanguageService } from '@core/services/language.service';

export const contactGuard: CanActivateFn = () => {
  const contactService = inject(ContactService);
  const languageService = inject(LanguageService);
  const router = inject(Router);

  if (contactService.formSubmitted()) {
    return true;
  }

  const lang = languageService.currentLang();
  return router.createUrlTree(['/', lang, 'contact-us']);
};
