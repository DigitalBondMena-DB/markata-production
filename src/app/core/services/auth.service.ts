import { computed, inject, Service, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, filter, finalize, first, map, tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { LoginRequest, User } from '@core/interfaces/auth.interface';
import { AuthEndpoints } from './auth.constants';
import { LanguageService } from './language.service';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly langService = inject(LanguageService);

  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Define httpResource to manage current user session state reactively
  readonly userResource = httpResource<User | null>(() => {
    return {
      url: `${environment.api}${AuthEndpoints.me}`
    };
  });

  // Readonly signals exposed for state tracking
  readonly currentUser = computed(() => this.userResource.hasValue() ? this.userResource.value() : null);
  readonly isLoggedIn = computed(() => !!this.currentUser());
  readonly loading = computed(() => this.userResource.isLoading() || this._loading());
  readonly error = this._error.asReadonly();

  /**
   * Log in the user using email and password.
   * Cookie is set automatically by the backend.
   */
  login(credentials: LoginRequest): Observable<User> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.post<any>(`${environment.api}${AuthEndpoints.login}`, credentials).pipe(
      map(response => {
        const user: User = response?.user || response?.data || response;
        if (!user || !user.email) {
          throw new Error('Invalid user data received from server');
        }
        return user;
      }),
      tap(user => {
        // Optimistically set/update the resource value
        this.userResource.value.set(user);
      }),
      catchError(err => {
        const errorMessage = err.error?.message || err.message || 'Login failed';
        this._error.set(errorMessage);
        return throwError(() => err);
      }),
      finalize(() => {
        this._loading.set(false);
      })
    );
  }

  /**
   * Log out the user.
   * Clears backend session cookie and resets local state.
   */
  logout(): Observable<void> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.post<void>(`${environment.api}${AuthEndpoints.logout}`, {}).pipe(
      catchError(() => {
        return of(undefined);
      }),
      finalize(() => {
        this.userResource.value.set(null);
        this._loading.set(false);
        const activeLang = this.langService.currentLang();
        this.router.navigate([activeLang, 'auth', 'signin']);
      })
    );
  }

  /**
   * Checks current authentication status by fetching user details.
   * Restores user session if a valid HttpOnly session cookie exists.
   */
  checkAuth(): Observable<User | null> {
    // Accessing the status registers interest in the signal, activating the lazy httpResource safely
    this.userResource.status();

    return toObservable(this.userResource.status).pipe(
      filter(status => status !== 'idle' && status !== 'loading' && status !== 'reloading'),
      first(),
      map(() => this.currentUser()),
      catchError(() => of(null))
    );
  }
}


