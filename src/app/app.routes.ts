import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { LanguageService } from './core/services/language.service';
import { langGuard } from './core/guards/lang.guard';
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
        path: 'podcasts/:slug',
        loadComponent: () =>
          import('./featurs/podcast/podcast-details/podcast-details.component').then(m => m.PodcastDetailsComponent)
      },
      {
        path: 'privacy-policy',
        loadComponent: () =>
          import('./featurs/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
      },
      {
        path: 'profile',
        canMatch: [authGuard],
        loadChildren: () => import('./featurs/profile/profile.routes').then(m => m.routes)
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
        path: 'writers',
        loadComponent: () =>
          import('./featurs/writers/pages/writers-list/writers.component').then(m => m.WritersListComponent)
      },
      {
        path: 'writers/:id',
        loadComponent: () =>
          import('./featurs/writers/pages/writers-details/writers-details.component').then(m => m.WritersDetailsComponent)
      },
      {
        path: 'contact-us',
        loadComponent: () =>
          import('./featurs/contact-us/pages/contact-us/contact-us.component').then(m => m.ContactUsComponent),
        loadChildren: () => import('./featurs/contact-us/contact-us.routes').then(m => m.routes)
      },
      {
        path: 'auth/signin',
        loadChildren: () => import('./featurs/auth/auth.route').then(m => m.authRoute)
      },
      {
        path: '404',
        loadComponent: () =>
          import('./featurs/not-found/not-found.component').then(m => m.NotFoundComponent)
      },
      {
        path: '**',
        loadComponent: () =>
          import('./featurs/not-found/not-found.component').then(m => m.NotFoundComponent)
      }
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: () => {
      const languageService = inject(LanguageService);
      const defaultLang = languageService.getBrowserOrSavedLang();
      return `${defaultLang}`;
    }
  },
  {
    path: '**',
    loadComponent: () =>
      import('./featurs/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
