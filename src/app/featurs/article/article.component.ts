import { Component, inject, input, computed, effect, ViewEncapsulation, signal, linkedSignal, untracked, DestroyRef, Renderer2, RESPONSE_INIT } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { ArticleService } from './services/article.service';
import { SeoService } from '@shared/services/seo.service';
import { NgOptimizedImage } from '@angular/common';
import { MarkataImageDirective } from '@shared/directives/markata-image.directive';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { environment } from '@env/environment';
import { DatePipe } from '@angular/common';
import { SocialSharePipe } from '@shared/pipes/social-share.pipe';
import { timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AudioPlayerComponent } from '@shared/components/audio-player/audio-player.component';


@Component({
  selector: 'app-article',
  imports: [
    RouterLink,
    TranslatePipe,
    NgOptimizedImage,
    MarkataImageDirective,
    SkeletonComponent,
    EmptyStateComponent,
    DatePipe,
    SocialSharePipe,
    AudioPlayerComponent
  ],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ArticleComponent {
  readonly destroyRef = inject(DestroyRef);
  readonly lang = inject(LanguageService);
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private readonly seoService = inject(SeoService);
  private readonly articleService = inject(ArticleService);
  private readonly router = inject(Router);
  private readonly responseInit = inject(RESPONSE_INIT, { optional: true });

  readonly slug = input<string>();

  readonly activeHeadingId = signal<string | null>(null);

  readonly loadedLang = linkedSignal({
    source: this.slug,
    computation: () => null as string | null
  });

  readonly otherSlug = linkedSignal({
    source: this.slug,
    computation: () => null as string | null
  });

  readonly activeSlug = computed(() => {
    const currentSlug = this.slug();
    const activeLang = this.lang.currentLang();
    const loadedLanguage = this.loadedLang();
    if (loadedLanguage && activeLang !== loadedLanguage) {
      const translationSlug = untracked(this.otherSlug);
      if (translationSlug) {
        return translationSlug;
      }
    }
    return currentSlug;
  });

  readonly articleResource = this.articleService.getArticle(this.activeSlug);


  readonly articleData = computed(() => {
    if (this.articleResource.status() === 'resolved') {
      return this.articleResource.value()?.data;
    }
    return undefined;
  });
  readonly nextArticles = computed(() => {
    if (this.articleResource.status() === 'resolved') {
      return this.articleResource.value()?.next_articles ?? [];
    }
    return [];
  });
  readonly relatedArticles = computed(() => {
    if (this.articleResource.status() === 'resolved') {
      return this.articleResource.value()?.related_articles ?? [];
    }
    return [];
  });
  readonly randomArticles = computed(() => {
    if (this.articleResource.status() === 'resolved') {
      return this.articleResource.value()?.random_articles ?? [];
    }
    return [];
  });

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

  private readonly processedContent = computed(() => {
    const rawHtml = this.articleBodyHtml();
    if (!rawHtml) {
      return { html: '', headings: [] as { id: string; text: string }[] };
    }

    const headingsList: { id: string; text: string }[] = [];
    let headingIndex = 0;

    // Regex to match <h2> tags, capturing attributes and inner content
    const modifiedHtml = rawHtml.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (match: string, attrs: string, content: string) => {
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


  readonly articleUrl = computed(() => {
    const slugVal = this.slug();
    const langVal = this.lang.currentLang();
    if (!slugVal) return '';
    return `${environment.siteUrl}/${langVal}/article/${slugVal}`;
  });



  constructor() {
    // Set 404 status code if article is not found on SSR
    effect(() => {
      const isLoaded = !this.articleResource.isLoading();
      const hasError = !!this.articleResource.error();
      const hasNoData = !this.articleData();

      if (isLoaded && (hasError || hasNoData) && this.responseInit) {
        this.responseInit.status = 404;
      }
    });

    effect(() => {
      if (this.articleResource.status() !== 'resolved') {
        return;
      }
      const response = this.articleResource.value();
      if (response?.seo) {
        this.seoService.updateSeo(response.seo);
      }
      const activeLang = this.lang.currentLang();
      const loadedLanguage = untracked(this.loadedLang);

      // If active language changed relative to loaded language, redirect to translation slug
      if (loadedLanguage && activeLang !== loadedLanguage) {
        const translationSlug = untracked(this.otherSlug);
        if (translationSlug) {
          this.router.navigate(['/', activeLang, 'article', translationSlug], { replaceUrl: true });
          return;
        }
      }

      // Track loaded language once response loads successfully
      if (response) {
        this.loadedLang.set(activeLang);
        if (response.other_slug) {
          this.otherSlug.set(response.other_slug);
        }
      }
    });

    // Signal-based DOM interaction for scrolling
    effect(() => {
      const headingId = this.activeHeadingId();
      if (headingId) {
        try {
          const element = this.renderer.selectRootElement(`#${headingId}`, true);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } catch (e) {
          // Fallback if selectRootElement fails or isn't appropriate
          const fallbackElement = this.document.getElementById(headingId);
          if (fallbackElement) {
            fallbackElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }

        // Reset the signal so the same heading can be clicked again
        untracked(() => this.activeHeadingId.set(null));
      }
    });
  }



  scrollToHeading(event: Event, id: string): void {
    event.preventDefault();
    this.activeHeadingId.set(id);
  }

  readonly copied = signal(false);

  copyArticleLink(event: Event): void {
    event.preventDefault();
    const url = this.articleUrl();
    const nav = this.document.defaultView?.navigator;

    if (nav?.clipboard) {
      nav.clipboard.writeText(url).then(() => {
        this.copied.set(true);
        timer(2000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.copied.set(false));
      }).catch(err => {
        console.error('Failed to copy link: ', err);
      });
    }
  }
}
