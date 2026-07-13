import { Component, inject, input, computed, effect, ViewEncapsulation, signal, linkedSignal, untracked, DestroyRef, Renderer2, RESPONSE_INIT, afterRenderEffect } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
import { SubscribeFormComponent } from '@shared/components/subscribe-form/subscribe-form.component';
import { processHtmlHeadings } from '@shared/utils/html-processor.util';
import { BookmarkButtonComponent } from '@shared/components/bookmark-button/bookmark-button.component';


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
    AudioPlayerComponent,
    SubscribeFormComponent,
    BookmarkButtonComponent
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
  private readonly sanitizer = inject(DomSanitizer);

  readonly slug = input<string>();

  readonly activeHeadingId = signal<string | null>(null);
  readonly activeTocId = signal<string | null>(null);

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
      return undefined;
    }
    return currentSlug;
  });

  readonly articleResource = this.articleService.getArticle(this.activeSlug);
  readonly articleResponse = computed(() => {
    return this.articleResource.status() === 'resolved'
      ? this.articleResource.value()
      : undefined;
  });

  readonly articleData = computed(() => this.articleResponse()?.data);

  readonly nextArticles = computed(() => this.articleResponse()?.next_articles ?? []);

  readonly relatedArticles = computed(() => this.articleResponse()?.related_articles ?? []);

  readonly randomArticles = computed(() => this.articleResponse()?.random_articles ?? []);

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

  private readonly processedContent = computed(() => processHtmlHeadings(this.articleBodyHtml()));

  readonly articleBodyHtmlWithIds = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.processedContent().html));
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

    // Sync SEO metadata and track loaded language state
    effect(() => {
      if (this.articleResource.status() !== 'resolved') {
        return;
      }
      const response = this.articleResponse();
      if (response?.seo) {
        this.seoService.updateSeo(response.seo);
      }

      // Track loaded language once response loads successfully
      if (response) {
        const activeLang = this.lang.currentLang();
        this.loadedLang.set(activeLang);
        if (response.other_slug) {
          this.otherSlug.set(response.other_slug);
        }
      }
    });

    // Redirect to translated slug when active language changes
    effect(() => {
      const activeLang = this.lang.currentLang();
      const loadedLanguage = untracked(this.loadedLang);
      const translationSlug = untracked(this.otherSlug);

      if (loadedLanguage && activeLang !== loadedLanguage && translationSlug) {
        untracked(() => {
          this.loadedLang.set(null);
          this.otherSlug.set(null);
        });
        this.router.navigate(['/', activeLang, 'article', translationSlug], { replaceUrl: true });
      }
    });

    // Signal-based DOM interaction for scrolling
    effect(() => {
      const headingId = this.activeHeadingId();
      if (headingId) {
        try {
          const element = this.renderer.selectRootElement(`#${headingId}`, true);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } catch (e) {
          // Fallback if selectRootElement fails or isn't appropriate
          const fallbackElement = this.document.getElementById(headingId);
          if (fallbackElement) {
            fallbackElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }

        // Reset the signal so the same heading can be clicked again
        untracked(() => this.activeHeadingId.set(null));
      }
    });

    let observer: IntersectionObserver | null = null;

    afterRenderEffect({
      read: () => {
        const hList = this.headings();
        if (hList.length === 0) {
          if (observer) {
            observer.disconnect();
            observer = null;
          }
          this.activeTocId.set(null);
          return;
        }

        if (observer) {
          observer.disconnect();
          observer = null;
        }

        const elements = hList
          .map(h => this.document.getElementById(h.id))
          .filter((el): el is HTMLElement => el !== null);

        if (elements.length === 0) return;

        const options: IntersectionObserverInit = {
          root: null,
          rootMargin: '-120px 0px -70% 0px',
          threshold: 0
        };

        const visibleHeadings = new Map<string, boolean>();

        const updateActiveHeading = () => {
          const intersecting = hList.filter(h => visibleHeadings.get(h.id));
          if (intersecting.length > 0) {
            this.activeTocId.set(intersecting[0].id);
          } else {
            let activeId = hList[0]?.id || null;
            let bestTop = -Infinity;

            for (const h of hList) {
              const el = this.document.getElementById(h.id);
              if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= 150) {
                  if (rect.top > bestTop) {
                    bestTop = rect.top;
                    activeId = h.id;
                  }
                }
              }
            }
            this.activeTocId.set(activeId);
          }
        };

        observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            visibleHeadings.set(entry.target.id, entry.isIntersecting);
          });
          updateActiveHeading();
        }, options);

        elements.forEach(el => observer?.observe(el));

        // Initial check
        updateActiveHeading();
      }
    });

    this.destroyRef.onDestroy(() => {
      if (observer) {
        observer.disconnect();
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
