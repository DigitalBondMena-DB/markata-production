import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@env/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith(environment.api)) {
    const clonedRequest = req.clone({
      withCredentials: true
    });
    return next(clonedRequest);
  }
  return next(req);
};
