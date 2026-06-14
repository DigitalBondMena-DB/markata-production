import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: ':lang',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      return [
        { lang: 'en' },
        { lang: 'ar' }
      ];
    }
  },
  {
    path: ':lang/home',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      return [
        { lang: 'en' },
        { lang: 'ar' }
      ];
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
