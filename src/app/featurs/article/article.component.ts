import { Component, inject, input, computed, effect, ViewEncapsulation, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { httpResource } from '@angular/common/http';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../shared/services/seo.service';
import { MarkataImgPlaceholderDirective } from '../../shared/directives/markata-img-placeholder.directive';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { environment } from '../../../environments/environment';
import { ArticleDetailsResponse } from '../../core/interfaces/article-page.interface';

@Component({
  selector: 'app-article',
  imports: [
    RouterLink,
    TranslatePipe,
    MarkataImgPlaceholderDirective,
    SkeletonComponent,
    EmptyStateComponent
  ],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ArticleComponent {
  readonly lang = inject(LanguageService);
  private readonly seoService = inject(SeoService);

  readonly socialXGlyph = '𝕏';

  // Slug input binding from Router path parameter
  readonly slug = input<string>();

  // Fetch article data dynamically via httpResource
  readonly articleResource = httpResource<ArticleDetailsResponse>(() => {
    const currentSlug = this.slug();
    const activeLang = this.lang.currentLang();

    if (!currentSlug) return undefined;

    return {
      url: `${environment.api}articles/${currentSlug}`,
      headers: {
        'Accept-Language': activeLang
      }
    };
  });

  // Mapped resource values
  readonly articleData = computed(() => this.articleResource.value()?.data);
  readonly nextArticles = computed(() => this.articleResource.value()?.next_articles ?? []);
  readonly relatedArticles = computed(() => this.articleResource.value()?.related_articles ?? []);
  readonly randomArticles = computed(() => this.articleResource.value()?.random_articles ?? []);

  // Formatted article body HTML (handles both raw HTML and plain text paragraphs)
  readonly articleBodyHtml = computed(() => {
    const bodyText = this.articleData()?.body;
    if (!bodyText) return '';
    // Check if it doesn't look like HTML
    if (!/<[a-z][\s\S]*>/i.test(bodyText)) {
      return bodyText
        .replace(/\r\n/g, '\n')
        .split('\n\n')
        .filter(p => p.trim().length > 0)
        .map(p => `<p class="article-body-text">${p}</p>`)
        .join('');
    }
    return bodyText;
  });

  // Track parsed headings for Table of Contents (TOC)
  readonly headings = signal<{ id: string; text: string }[]>([]);

  // Formatted publication date helper
  readonly formattedDate = computed(() => {
    const dateStr = this.articleData()?.published_at;
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(this.lang.currentLang() === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  });

  // Social share link computed helpers (SSR-safe check for window)
  readonly facebookShareHref = computed(() => {
    const share = this.articleData()?.share;
    if (share?.facebook) return share.facebook;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  });

  readonly twitterShareHref = computed(() => {
    const share = this.articleData()?.share;
    if (share?.twitter) return share.twitter;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
  });

  readonly linkedinShareHref = computed(() => {
    const share = this.articleData()?.share;
    if (share?.linkedin) return share.linkedin;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  });

  constructor() {
    // Sync SEO metadata automatically on resource load
    effect(() => {
      const response = this.articleResource.value();
      if (response?.seo) {
        this.seoService.updateSeo(response.seo);
      }
    });

    // Detect when content is loaded and parse headings
    effect(() => {
      const isLoading = this.articleResource.isLoading();
      const data = this.articleData();

      if (!isLoading && data) {
        // Wait for rendering to finish
        setTimeout(() => {
          this.parseHeadings();
        }, 120);
      }
    });
  }

  private parseHeadings(): void {
    if (typeof document === 'undefined') return;
    const bodyEl = document.querySelector('.article-body-col');
    if (!bodyEl) return;

    // Collect all h2 elements inside the body
    const h2Elements = bodyEl.querySelectorAll('h2');
    const parsedHeadings: { id: string; text: string }[] = [];

    h2Elements.forEach((h2, index) => {
      let id = h2.id;
      if (!id) {
        id = `heading-${index + 1}`;
        h2.id = id;
      }
      parsedHeadings.push({
        id,
        text: h2.textContent || h2.innerText || `Heading ${index + 1}`
      });
    });

    this.headings.set(parsedHeadings);
  }

  scrollToHeading(event: Event, id: string): void {
    event.preventDefault();
    if (typeof document === 'undefined') return;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  shareStub(event: Event): void {
    event.preventDefault();
  }

  copyArticleLink(event: Event): void {
    event.preventDefault();
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
    }
  }
}
