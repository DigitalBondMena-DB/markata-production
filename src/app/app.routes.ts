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
        path: 'blog/:id',
        loadComponent: () =>
          import('./featurs/blog-details/blog-details.component').then(m => m.BlogDetailsComponent)
      }
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
