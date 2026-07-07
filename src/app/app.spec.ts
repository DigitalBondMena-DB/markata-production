import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { AuthService } from '@core/services/auth.service';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('App', () => {
  beforeEach(async () => {
    const mockTranslateService = {
      getBrowserLang: () => 'en',
      addLangs: () => {},
      use: () => {}
    };

    const mockLanguageService = {
      currentLang: signal('en'),
      getBrowserOrSavedLang: () => 'en',
      setLanguage: () => {},
      initLang: () => {}
    };

    const mockAuthService = {
      isAuthChecked: signal(true),
      isLoggedIn: signal(false),
      currentUser: signal(null),
      checkAuth: () => Promise.resolve(true),
      logout: () => ({ subscribe: () => {} })
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: LanguageService, useValue: mockLanguageService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
