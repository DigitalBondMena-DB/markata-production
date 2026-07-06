import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: ':lang/profile',
    renderMode: RenderMode.Client
  },
  {
    path: ':lang/auth/signin',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [{ lang: 'ar' }, { lang: 'en' }]
  },
  {
    path: ':lang/auth/signin/register',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [{ lang: 'ar' }, { lang: 'en' }]
  },
  {
    path: ':lang/auth/signin/forgot-password',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [{ lang: 'ar' }, { lang: 'en' }]
  },
  {
    path: ':lang/auth/signin/reset-password',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [{ lang: 'ar' }, { lang: 'en' }]
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
