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
  readonly articleData = computed(() => {
    console.log(this.articleResource.value()?.data)
    return this.articleResource.value()?.data
  });
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

  // Process the HTML to inject IDs into H2 elements and extract the headings list
  private readonly processedContent = computed(() => {
    const rawHtml = this.articleBodyHtml();
    if (!rawHtml) {
      return { html: '', headings: [] as { id: string; text: string }[] };
    }

    const headingsList: { id: string; text: string }[] = [];
    let headingIndex = 0;

    // Regex to match <h2> tags, capturing attributes and inner content
    const modifiedHtml = rawHtml.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attrs, content) => {
      headingIndex++;
      const id = `heading-${headingIndex}`;

      // Extract plain text for the TOC (strip inner HTML tags if any)
      const text = content.replace(/<[^>]*>/g, '').trim() || `Heading ${headingIndex}`;

      headingsList.push({ id, text });

      // Remove any existing id attribute in the matched tag to avoid duplicates
      let cleanAttrs = attrs.replace(/\bid\s*=\s*['"][^'"]*['"]/i, '').trim();
      if (cleanAttrs) {
        cleanAttrs = ' ' + cleanAttrs;
      }

      return `<h2 id="${id}"${cleanAttrs}>${content}</h2>`;
    });

    return { html: modifiedHtml, headings: headingsList };
  });

  readonly articleBodyHtmlWithIds = computed(() => this.processedContent().html);
  readonly headings = computed(() => this.processedContent().headings);

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

  // Canonical article URL computed dynamically (works perfectly in SSR)
  readonly articleUrl = computed(() => {
    const slugVal = this.slug();
    const langVal = this.lang.currentLang();
    if (!slugVal) return '';
    return `${environment.siteUrl}/${langVal}/article/${slugVal}`;
  });

  // Social share link computed helpers
  readonly facebookShareHref = computed(() => {
    const share = this.articleData()?.share;
    if (share?.facebook) return share.facebook;
    const url = this.articleUrl();
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  });

  readonly twitterShareHref = computed(() => {
    const share = this.articleData()?.share;
    if (share?.twitter) return share.twitter;
    const url = this.articleUrl();
    const title = this.articleData()?.title || '';
    return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  });

  readonly linkedinShareHref = computed(() => {
    const share = this.articleData()?.share;
    if (share?.linkedin) return share.linkedin;
    const url = this.articleUrl();
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

  readonly copied = signal(false);

  copyArticleLink(event: Event): void {
    event.preventDefault();
    const url = this.articleUrl();
    if (url && typeof window !== 'undefined') {
      navigator.clipboard.writeText(url).then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      }).catch(err => {
        console.error('Failed to copy link: ', err);
      });
    }
  }
}
