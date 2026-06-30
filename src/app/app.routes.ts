import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { LanguageService } from './core/services/language.service';
import { langGuard } from './core/guards/lang.guard';



export const routes: Routes = [
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
        path: 'privacy-policy',
        loadComponent: () =>
          import('./featurs/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
      },
      {
        path: 'case-studies',
        loadComponent: () =>
          import('./featurs/category/category.component').then(m => m.CategoryComponent)
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
          import('./featurs/auth/signin/signin.component').then(m => m.SigninComponent)
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
