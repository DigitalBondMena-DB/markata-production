import { computed, inject, signal, TransferState, makeStateKey, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { LoginRequest, User, ResetPasswordRequest, RegisterRequest } from '@core/interfaces/auth.interface';
import { AuthEndpoints } from './auth.constants';
import { LanguageService } from './language.service';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly langService = inject(LanguageService);
  private readonly transferState = inject(TransferState);

  private readonly _currentUser = signal<User | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _isAuthChecked = signal(false);

  readonly currentUser = this._currentUser.asReadonly();

  readonly isLoggedIn = computed(() => !!this._currentUser());

  readonly isAuthChecked = this._isAuthChecked.asReadonly();

  readonly loading = this._loading.asReadonly();

  readonly error = this._error.asReadonly();

  login(credentials: LoginRequest): Observable<User> {
    this._loading.set(true);
    this._error.set(null);

    return this.http
      .post<ApiResponse<{ user: User }>>(
        `${environment.api}${AuthEndpoints.login}`,
        credentials
      )
      .pipe(
        map(res => res.data.user),

        tap(user => {
          this._currentUser.set(user);
          this._isAuthChecked.set(true);
        }),

        catchError(err => {
          this._currentUser.set(null);

          this._error.set(
            err.error?.message ??
            'Invalid email or password.'
          );

          throw err;
        }),

        finalize(() => {
          this._loading.set(false);
        })
      );
  }

  checkAuth(): Observable<User | null> {
    const USER_KEY = makeStateKey<User | null>('user');

    if (this.transferState.hasKey(USER_KEY)) {
      const user = this.transferState.get(USER_KEY, null);
      if (user) {
        this._currentUser.set(user);
        this._isAuthChecked.set(true);
        return of(user);
      }
    }

    return this.http
      .get<any>(
        `${environment.api}${AuthEndpoints.me}`
      )
      .pipe(
        map(res => {
          if (res && res.data) {
            return res.data.user || res.data;
          }
          return res;
        }),
        tap(user => {
          this._currentUser.set(user);
          this._isAuthChecked.set(true);
          if (user) {
            this.transferState.set(USER_KEY, user);
          }
        }),
        catchError(err => {
          if (err.status !== 401) {
            console.error('checkAuth API error:', err);
          }
          this._currentUser.set(null);
          this._isAuthChecked.set(true);
          return of(null);
        })
      );
  }

  logout(): Observable<void> {
    // Clear client-side state immediately
    this._currentUser.set(null);
    this._error.set(null);
    this._isAuthChecked.set(true);
    const USER_KEY = makeStateKey<User | null>('user');
    this.transferState.remove(USER_KEY);

    // Navigate to signin immediately
    this.router.navigate([
      this.langService.currentLang(),
      'auth',
      'signin',
    ]);

    // Send the server-side logout request in the background
    this.http
      .post<void>(
        `${environment.api}${AuthEndpoints.logout}`,
        {}
      )
      .pipe(
        catchError((err) => {
          console.error('Background logout API error:', err);
          return of(void 0);
        })
      )
      .subscribe({
        next: () => { },
        complete: () => this._loading.set(false)
      });

    return of(void 0);
  }

  forgotPassword(email: string): Observable<ApiResponse<any>> {
    this._loading.set(true);
    this._error.set(null);

    return this.http
      .post<ApiResponse<any>>(
        `${environment.api}${AuthEndpoints.forgotPassword}`,
        { email }
      )
      .pipe(
        catchError(err => {
          this._error.set(
            err.error?.message ?? 'An error occurred. Please try again.'
          );
          throw err;
        }),
        finalize(() => {
          this._loading.set(false);
        })
      );
  }

  resetPassword(payload: ResetPasswordRequest): Observable<ApiResponse<any>> {
    this._loading.set(true);
    this._error.set(null);

    return this.http
      .post<ApiResponse<any>>(
        `${environment.api}${AuthEndpoints.resetPassword}`,
        payload
      )
      .pipe(
        catchError(err => {
          this._error.set(
            err.error?.message ?? 'An error occurred. Please try again.'
          );
          throw err;
        }),
        finalize(() => {
          this._loading.set(false);
        })
      );
  }

  register(payload: RegisterRequest): Observable<any> {
    this._loading.set(true);
    this._error.set(null);

    return this.http
      .post<ApiResponse<any>>(
        `${environment.api}${AuthEndpoints.register}`,
        payload
      )
      .pipe(
        tap(res => {
          const user = res?.data?.user || res?.data;
          if (user && user.id) {
            this._currentUser.set(user);
            this._isAuthChecked.set(true);
          }
        }),
        catchError(err => {
          this._error.set(
            err.error?.message ?? 'An error occurred during registration.'
          );
          throw err;
        }),
        finalize(() => {
          this._loading.set(false);
        })
      );
  }

  updateProfile(payload: { name: string; email: string; phone?: string }): Observable<User> {
    this._loading.set(true);
    this._error.set(null);

    return this.http
      .patch<ApiResponse<{ user: User } | User>>(
        `${environment.api}${AuthEndpoints.profile}`,
        payload
      )
      .pipe(
        map(res => {
          if ('data' in res && res.data) {
            return (res.data as any).user || res.data;
          }
          return res;
        }),
        tap(user => {
          if (user) {
            this._currentUser.set(user);
          }
        }),
        catchError(err => {
          this._error.set(
            err.error?.message ?? 'An error occurred while updating profile.'
          );
          throw err;
        }),
        finalize(() => {
          this._loading.set(false);
        })
      );
  }
}