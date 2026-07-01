import { computed, inject, Injectable, PLATFORM_ID, signal, TransferState, makeStateKey } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { LoginRequest, User } from '@core/interfaces/auth.interface';
import { AuthEndpoints } from './auth.constants';
import { LanguageService } from './language.service';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly langService = inject(LanguageService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly transferState = inject(TransferState);

  private readonly _currentUser = signal<User | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly currentUser = this._currentUser.asReadonly();

  readonly isLoggedIn = computed(() => !!this._currentUser());

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
        return of(user);
      }
    }

    return this.http
      .get<any>(
        `${environment.api}${AuthEndpoints.me}`
      )
      .pipe(
        tap(res => console.log('Raw checkAuth API response:', res)),
        map(res => {
          if (res && res.data) {
            return res.data.user || res.data;
          }
          return res;
        }),
        tap(user => {
          console.log('Mapped user in checkAuth:', user);
          this._currentUser.set(user);
          if (user) {
            this.transferState.set(USER_KEY, user);
          }
        }),
        catchError(err => {
          if (err.status !== 401) {
            console.error('checkAuth API error:', err);
          }
          this._currentUser.set(null);
          return of(null);
        })
      );
  }

  logout(): Observable<void> {
    console.log("logout method called in AuthService");

    // Clear client-side state immediately
    this._currentUser.set(null);
    this._error.set(null);
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
        next: () => console.log('Background logout API request succeeded'),
        complete: () => this._loading.set(false)
      });

    return of(void 0);
  }
}