import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ServerErrorService } from '../services/server-error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const serverErrorService = inject(ServerErrorService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status >= 500) {
          serverErrorService.showError(error);
        }
      }
      return throwError(() => error);
    })
  );
};
