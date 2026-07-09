import { HttpInterceptorFn } from '@angular/common/http';
import { inject, REQUEST } from '@angular/core';
import { environment } from '@env/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.api)) {
    return next(req);
  }

  const url = req.url.toLowerCase();
  if (!environment.isProduction) {
    const isAuthRequest = url.includes('/auth/') || url.includes('/favorites') || url.includes('/categories') || url.includes('/profile');

    if (!isAuthRequest) {
      return next(req);
    }
  }

  const serverRequest = inject(REQUEST, { optional: true }) as any;
  let headers = req.headers;

  if (serverRequest) {
    let cookie: string | undefined;
    if (serverRequest.headers) {
      if (typeof serverRequest.headers.get === 'function') {
        cookie = serverRequest.headers.get('cookie') || undefined;
      } else {
        cookie = serverRequest.headers['cookie'] || undefined;
      }
    }
    if (cookie) {
      headers = headers.set('Cookie', cookie);
    }
  }

  return next(
    req.clone({
      headers,
      withCredentials: true,
    })
  );
};