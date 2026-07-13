import { inject, RendererFactory2, Service } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { SeoData } from '../../core/interfaces/home.interface';
import { environment } from '../../../environments/environment';
import { SiteService } from '../../core/services/site.service';

@Service()
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(RendererFactory2).createRenderer(null, null);
  private readonly siteService = inject(SiteService);


  updateSeo(seo: SeoData): void {
    if (!seo) return;

    const siteName = this.siteService.siteName() || 'Markata';

    // 1. Title
    this.title.setTitle(seo.meta_title || siteName);

    // 2. Standard Meta Tags
    this.meta.updateTag({ name: 'application-name', content: siteName });
    this.meta.updateTag({ name: 'apple-mobile-web-app-title', content: siteName });
    this.meta.updateTag({ name: 'description', content: seo.meta_description || '' });
    this.meta.updateTag({ name: 'keywords', content: seo.keywords || '' });
    this.meta.updateTag({ name: 'robots', content: seo.robots || 'index,follow' });

    // 3. Open Graph Meta Tags
    if (seo.og) {
      this.meta.updateTag({ property: 'og:site_name', content: siteName });
      this.meta.updateTag({ property: 'og:title', content: seo.og.title || seo.meta_title });
      this.meta.updateTag({ property: 'og:description', content: seo.og.description || seo.meta_description });
      if (seo.og.image) {
        this.meta.updateTag({ property: 'og:image', content: this.resolveImageUrl(seo.og.image) });
      } else {
        this.meta.removeTag('property="og:image"');
      }
    }

    // 4. Twitter Card Meta Tags
    if (seo.twitter) {
      this.meta.updateTag({ name: 'twitter:card', content: seo.twitter.card || 'summary_large_image' });
      this.meta.updateTag({ name: 'twitter:title', content: seo.twitter.title || seo.meta_title });
      this.meta.updateTag({ name: 'twitter:description', content: seo.twitter.description || seo.meta_description });
      if (seo.twitter.image) {
        this.meta.updateTag({ name: 'twitter:image', content: this.resolveImageUrl(seo.twitter.image) });
      } else {
        this.meta.removeTag('name="twitter:image"');
      }
    }

    // 5. Canonical & Hreflang Tags
    this.updateLinkTags(seo.canonical_url);

    // 6. Schema Markup
    this.updateSchemaMarkup(seo.schema_markup);
  }

  private resolveImageUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${environment.imageBaseUrl}${path}`;
  }

  private updateLinkTags(apiCanonicalUrl: string | null): void {
    const siteUrl = environment.siteUrl;
    const currentUrl = this.router.url;

    // Process current path segments
    const cleanPath = currentUrl.split('?')[0].split('#')[0];
    const segments = cleanPath.split('/').filter(Boolean);

    let pathSegment = '';
    if (segments.length > 0) {
      if (segments[0] === 'ar' || segments[0] === 'en') {
        pathSegment = segments.slice(1).join('/');
      } else {
        pathSegment = segments.join('/');
      }
    }

    const pathSuffix = pathSegment ? `/${pathSegment}` : '';
    const arUrl = `${siteUrl}/ar${pathSuffix}`;
    const enUrl = `${siteUrl}/en${pathSuffix}`;
    const xDefaultUrl = `${siteUrl}/en${pathSuffix}`; // x-default maps to en

    // Set Canonical URL
    const canonicalUrl = `${siteUrl}${cleanPath}`;
    let canonicalLink = this.document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = this.renderer.createElement('link');
      this.renderer.setAttribute(canonicalLink, 'rel', 'canonical');
      this.renderer.appendChild(this.document.head, canonicalLink);
    }
    this.renderer.setAttribute(canonicalLink, 'href', canonicalUrl);

    // Set Alternate Hreflang URLs
    const hreflangMap = {
      'ar': arUrl,
      'en': enUrl,
      'x-default': xDefaultUrl
    };

    Object.entries(hreflangMap).forEach(([lang, href]) => {
      let link = this.document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`);
      if (!link) {
        link = this.renderer.createElement('link');
        this.renderer.setAttribute(link, 'rel', 'alternate');
        this.renderer.setAttribute(link, 'hreflang', lang);
        this.renderer.appendChild(this.document.head, link);
      }
      this.renderer.setAttribute(link, 'href', href);
    });
  }

  private updateSchemaMarkup(schemaMarkup: any): void {
    // 1. Remove existing schema markup script if it exists
    const existingSchema = this.document.getElementById('app-schema-markup');
    if (existingSchema) {
      this.renderer.removeChild(this.document.head, existingSchema);
    }

    if (!schemaMarkup) return;

    let schemaString = '';
    if (typeof schemaMarkup === 'string') {
      try {
        const parsed = JSON.parse(schemaMarkup);
        schemaString = JSON.stringify(parsed);
      } catch (e) {
        console.warn('SEO Service: Invalid JSON in schema_markup. Skipping injection.', e);
        return;
      }
    } else if (typeof schemaMarkup === 'object' && schemaMarkup !== null) {
      schemaString = JSON.stringify(schemaMarkup);
    }

    if (schemaString) {
      const script = this.renderer.createElement('script');
      this.renderer.setAttribute(script, 'id', 'app-schema-markup');
      this.renderer.setAttribute(script, 'type', 'application/ld+json');
      this.renderer.setProperty(script, 'text', schemaString);
      this.renderer.appendChild(this.document.head, script);
    }
  }
}
