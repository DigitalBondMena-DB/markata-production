import { computed, inject, Service, RendererFactory2, effect, untracked } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, first, firstValueFrom } from 'rxjs';
import { environment } from '@env/environment';
import { LanguageService } from './language.service';
import { SiteSettings, SiteSettingsResponse } from '../interfaces/site-settings.interface';

@Service()
export class SiteService {
  private readonly langService = inject(LanguageService);
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(RendererFactory2).createRenderer(null, null);

  readonly siteResource = httpResource<SiteSettingsResponse>(() => {
    const lang = this.langService.currentLang();
    return {
      url: `${environment.api}settings/site`,
      headers: {
        'Accept-Language': lang,
      },
    };
  });

  // Readonly signals for components to consume
  readonly settings = computed(() => this.siteResource.value()?.data ?? null);
  readonly siteName = computed(() => this.settings()?.site_name ?? '');
  readonly logoUrl = computed(() => {
    const url = this.settings()?.logo_url;
    if (!url) return '';
    return url.startsWith('http') ? url : `${environment.imageBaseUrl}${url}`;
  });
  readonly faviconUrl = computed(() => {
    const url = this.settings()?.favicon_url;
    if (!url) return '';
    return url.startsWith('http') ? url : `${environment.imageBaseUrl}${url}`;
  });
  readonly copyright = computed(() => this.settings()?.copyright ?? '');

  constructor() {
    // Watch for favicon changes and update it dynamically
    effect(() => {
      const url = this.faviconUrl();
      if (url) {
        untracked(() => this.updateFavicon(url));
      }
    });
  }

  loadSiteSettings(): Promise<any> {
    return firstValueFrom(
      toObservable(this.siteResource.isLoading).pipe(
        filter((loading) => !loading),
        first()
      )
    );
  }

  private updateFavicon(url: string): void {
    try {
      const linkTags = this.document.querySelectorAll('link[rel*="icon"]');
      if (linkTags.length > 0) {
        linkTags.forEach((tag) => {
          this.renderer.setAttribute(tag, 'href', url);
        });
      } else {
        const link = this.renderer.createElement('link');
        this.renderer.setAttribute(link, 'rel', 'icon');
        this.renderer.setAttribute(link, 'href', url);
        this.renderer.appendChild(this.document.head, link);
      }
    } catch (e) {
      console.warn('Failed to update favicon:', e);
    }
  }
}
