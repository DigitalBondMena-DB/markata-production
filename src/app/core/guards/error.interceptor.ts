import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LanguageService } from '@core/services/language.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const languageService = inject(LanguageService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 404) {
        const lang = languageService.currentLang() || languageService.getBrowserOrSavedLang();
        router.navigate([lang, '404']);
      }
      return throwError(() => error);
    })
  );
};
