import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, HttpErrorResponse, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { errorInterceptor } from './error.interceptor';
import { LanguageService } from '../services/language.service';
import { signal } from '@angular/core';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';

describe('errorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let routerSpy: any;
  let languageServiceSpy: any;

  beforeEach(() => {
    routerSpy = { navigate: vi.fn() };
    languageServiceSpy = {
      currentLang: signal('en'),
      getBrowserOrSavedLang: vi.fn().mockReturnValue('en')
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy },
        { provide: LanguageService, useValue: languageServiceSpy }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should NOT navigate to /lang/404 when a 404 HttpErrorResponse is received', () => {
    httpClient.get('/api/test-404').subscribe({
      next: () => {},
      error: (error) => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne('/api/test-404');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });

    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should NOT navigate when response status is not 404', () => {
    httpClient.get('/api/test-500').subscribe({
      next: () => {},
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('/api/test-500');
    req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });

    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
