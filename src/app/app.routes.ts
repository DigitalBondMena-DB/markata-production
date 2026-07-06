import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { LanguageService } from './core/services/language.service';
import { langGuard } from './core/guards/lang.guard';
import { resetPasswordGuard } from './core/guards/reset-password.guard';
import { authGuard } from './core/guards/auth.guard';



export const routes: Routes = [
  {
    path: 'reset-password',
    redirectTo: () => {
      const languageService = inject(LanguageService);
      const defaultLang = languageService.getBrowserOrSavedLang();
      return `${defaultLang}/auth/signin/reset-password`;
    }
  },
  {
    path: ':lang',
    canActivate: [langGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./featurs/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./featurs/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./featurs/search/search.component').then(m => m.SearchComponent)
      },
      {
        path: 'podcasts',
        loadComponent: () =>
          import('./featurs/podcast/podcast.component').then(m => m.PodcastComponent)
      },
      {
        path: 'privacy-policy',
        loadComponent: () =>
          import('./featurs/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./featurs/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'category',
        loadComponent: () =>
          import('./featurs/category/category.component').then(m => m.CategoryComponent)
      },
      {
        path: 'category/:slug',
        loadComponent: () =>
          import('./featurs/category/category.component').then(m => m.CategoryComponent)
      },
      {
        path: 'topic',
        loadComponent: () =>
          import('./featurs/category/category.component').then(m => m.CategoryComponent)
      },
      {
        path: 'topic/:slug',
        loadComponent: () =>
          import('./featurs/category/category.component').then(m => m.CategoryComponent)
      },
      {
        path: 'article/:slug',
        loadComponent: () =>
          import('./featurs/article/article.component').then(m => m.ArticleComponent)
      },
      {
        path: 'auth/signin',
        loadComponent: () =>
          import('./featurs/auth/signin/signin.component').then(m => m.SigninComponent),
        children: [
          {
            path: 'register',
            loadComponent: () =>
              import('./featurs/auth/register/register.component').then(m => m.RegisterComponent)
          },
          {
            path: 'forgot-password',
            loadComponent: () =>
              import('./featurs/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
          },
          {
            path: 'reset-password',
            canActivate: [resetPasswordGuard],
            loadComponent: () =>
              import('./featurs/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
          }
        ]
      },
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: () => {
      const languageService = inject(LanguageService);
      const defaultLang = languageService.getBrowserOrSavedLang();
      return `${defaultLang}`;  // ✅ روح لـ ':lang' مباشرة مش ':lang/home'
    }
  },
  {
    path: '**',
    redirectTo: () => {
      const languageService = inject(LanguageService);
      const defaultLang = languageService.getBrowserOrSavedLang();
      return `${defaultLang}`;
    }
  }
];
