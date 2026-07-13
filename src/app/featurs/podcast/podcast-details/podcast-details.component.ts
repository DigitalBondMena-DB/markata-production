import { Component, inject, input, computed, effect, ViewEncapsulation, signal, linkedSignal, untracked, DestroyRef, Renderer2, RESPONSE_INIT, afterRenderEffect } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT, DatePipe, NgOptimizedImage } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { PodcastService } from '../services/podcast.service';
import { SeoService } from '@shared/services/seo.service';
import { MarkataImageDirective } from '@shared/directives/markata-image.directive';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { environment } from '@env/environment';
import { SocialSharePipe } from '@shared/pipes/social-share.pipe';
import { timer, map } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { SubscribeFormComponent } from '@shared/components/subscribe-form/subscribe-form.component';
import { processHtmlHeadings } from '@shared/utils/html-processor.util';

@Component({
  selector: 'app-podcast-details',
  imports: [
    RouterLink,
    TranslatePipe,
    NgOptimizedImage,
    MarkataImageDirective,
    SkeletonComponent,
    EmptyStateComponent,
    DatePipe,
    SocialSharePipe,
    SubscribeFormComponent
  ],
  templateUrl: './podcast-details.component.html',
  styleUrl: './podcast-details.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class PodcastDetailsComponent {
  readonly destroyRef = inject(DestroyRef);
  readonly lang = inject(LanguageService);
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private readonly seoService = inject(SeoService);
  private readonly podcastService = inject(PodcastService);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly responseInit = inject(RESPONSE_INIT, { optional: true });
  private readonly route = inject(ActivatedRoute);

  readonly slug = input<string>();

  readonly activeHeadingId = signal<string | null>(null);
  readonly activeTocId = signal<string | null>(null);
  readonly sanitizedVideoUrl = signal<SafeResourceUrl | null>(null);

  readonly episodeParam = toSignal(this.route.queryParamMap.pipe(
    map(params => params.get('episode'))
  ));

  readonly activeEpisode = computed(() => {
    const param = this.episodeParam();
    const episodes = this.podcastData()?.episodes || [];
    if (!param) {
      return episodes[0] || null;
    }
    return episodes.find(e => String(e.slug) === param || String(e.id) === param) || episodes[0] || null;
  });

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

  readonly podcastResource = this.podcastService.getBroadcastDetails(this.activeSlug);

  readonly podcastData = computed(() => {
    if (this.podcastResource.status() === 'resolved') {
      return this.podcastResource.value()?.data;
    }
    return undefined;
  });

  readonly nextPodcasts = computed(() => {
    if (this.podcastResource.status() === 'resolved') {
      return this.podcastResource.value()?.next_broadcasts ?? [];
    }
    return [];
  });

  readonly relatedPodcasts = computed(() => {
    if (this.podcastResource.status() === 'resolved') {
      return this.podcastResource.value()?.related_broadcasts ?? [];
    }
    return [];
  });

  readonly randomPodcasts = computed(() => {
    if (this.podcastResource.status() === 'resolved') {
      return this.podcastResource.value()?.random_broadcasts ?? [];
    }
    return [];
  });

  // Formatted body HTML
  readonly podcastBodyHtml = computed(() => {
    const bodyText = this.podcastData()?.body;

    if (!bodyText) return '';
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

  private readonly processedContent = computed(() => processHtmlHeadings(this.podcastBodyHtml()));

  readonly podcastBodyHtmlWithIds = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.processedContent().html));
  readonly headings = computed(() => this.processedContent().headings);

  readonly podcastUrl = computed(() => {
    const slugVal = this.slug();
    const langVal = this.lang.currentLang();
    if (!slugVal) return '';
    return `${environment.siteUrl}/${langVal}/podcasts/${slugVal}`;
  });

  constructor() {
    effect(() => {
      const isLoaded = !this.podcastResource.isLoading();
      const hasError = !!this.podcastResource.error();
      const hasNoData = !this.podcastData();

      if (isLoaded && (hasError || hasNoData) && this.responseInit) {
        this.responseInit.status = 404;
      }
    });

    effect(() => {
      if (this.podcastResource.status() !== 'resolved') {
        return;
      }
      const response = this.podcastResource.value();
      if (response?.seo) {
        this.seoService.updateSeo(response.seo);
      }
      const activeLang = this.lang.currentLang();
      const loadedLanguage = untracked(this.loadedLang);

      if (loadedLanguage && activeLang !== loadedLanguage) {
        const translationSlug = untracked(this.otherSlug);
        if (translationSlug) {
          this.router.navigate(['/', activeLang, 'podcasts', translationSlug], { replaceUrl: true });
          return;
        }
      }

      if (response) {
        this.loadedLang.set(activeLang);
        if (response.other_slug) {
          this.otherSlug.set(response.other_slug);
        }
      }
    });

    effect(() => {
      const headingId = this.activeHeadingId();
      if (headingId) {
        try {
          const element = this.renderer.selectRootElement(`#${headingId}`, true);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } catch (e) {
          const fallbackElement = this.document.getElementById(headingId);
          if (fallbackElement) {
            fallbackElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }

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

  copyPodcastLink(event: Event): void {
    event.preventDefault();
    const url = this.podcastUrl();
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

  playVideo(url: string | null | undefined): void {
    if (url) {
      this.sanitizedVideoUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
    }
  }

  closeVideo(): void {
    this.sanitizedVideoUrl.set(null);
  }

  getRomanNumeral(num: number): string {
    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];
    return roman[num - 1] || String(num);
  }

  selectEpisode(ep: any): void {
    const slugOrId = ep.slug || ep.id;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { episode: slugOrId },
      queryParamsHandling: 'merge'
    });
    this.playVideo(ep.video_url);
  }
}
