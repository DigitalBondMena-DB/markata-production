import { CanActivateFn, Router } from "@angular/router";
import { LanguageService } from "../services/language.service";
import { inject } from "@angular/core";

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