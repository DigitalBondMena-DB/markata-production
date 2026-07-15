import { Component, signal, computed, inject, input, effect, linkedSignal, untracked, ViewEncapsulation, debounced, RESPONSE_INIT } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LanguageService } from '@core/services/language.service';
import { CategoryService } from './services/category.service';
import { SeoService } from '@shared/services/seo.service';
import { NgOptimizedImage } from '@angular/common';
import { MarkataImageDirective } from '@shared/directives/markata-image.directive';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { CaseStudiesCardComponent } from '@shared/components/case-studies-card/case-studies-card.component';
import { MainInnerHeaderComponent } from "@shared/components/main-inner-header/main-inner-header.component";
import { BookmarkButtonComponent } from '@shared/components/bookmark-button/bookmark-button.component';

@Component({
  selector: 'app-category',
  imports: [RouterLink, TranslatePipe, NgOptimizedImage, MarkataImageDirective, SkeletonComponent, EmptyStateComponent, PaginationComponent, CaseStudiesCardComponent, MainInnerHeaderComponent, BookmarkButtonComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CategoryComponent {
  readonly lang = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly seoService = inject(SeoService);
  private readonly categoryService = inject(CategoryService);
  private readonly responseInit = inject(RESPONSE_INIT, { optional: true });

  // Router binds the :slug parameter automatically
  readonly slug = input<string>('case-studies');

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

  // Track if we are on the Category route or Topic route
  readonly isCategoryRoute = computed(() => {
    return this.router.url.includes('/category');
  });

  // Filter value: reset when slug changes
  readonly filterVal = linkedSignal({
    source: this.slug,
    computation: () => ''
  });

  // Read query params as a signal
  readonly routeQueryParams = toSignal(this.route.queryParams, { initialValue: {} });

  // Page number: driven by queryParams for SEO
  readonly currentPage = computed(() => {
    const params = this.routeQueryParams() as Record<string, any>;
    const pageStr: string = params['page'] || '';
    const page: number = parseInt(pageStr, 10);
    return isNaN(page) || page < 1 ? 1 : page;
  });

  // Search input query
  readonly searchQuery = signal('');

  // Debounced search query using native debounced() from @angular/core
  readonly searchQueryDebounced = debounced(this.searchQuery, 300);

  // Layout view: grid or list
  readonly caseStudiesView = signal<'grid' | 'list'>('grid');

  // Fetch data dynamically using CategoryService
  readonly pageResource = this.categoryService.getCategoryPage({
    isCategoryRoute: () => this.isCategoryRoute(),
    slug: () => this.activeSlug() || '',
    filterVal: () => this.filterVal(),
    searchQueryDebounced: () => this.searchQueryDebounced.value() || '',
    currentPage: () => this.currentPage()
  });

  // Computed properties mapping the API response data
  readonly pageData = computed(() => {
    return this.pageResource.value()?.data;
  });
  readonly articles = computed(() => this.pageData()?.articles?.data ?? []);
  readonly meta = computed(() => this.pageData()?.articles?.meta);

  // Headline of the page (dynamic)
  readonly pageTitle = computed(() => this.pageData()?.name ?? '');

  // Filter options list (topics for category, categories for topic)
  readonly filterOptions = computed(() => {
    const data = this.pageData();
    if (!data) return [];
    return this.isCategoryRoute()
      ? (data.topics ?? [])
      : (data.categories ?? []);
  });

  // Results count text
  readonly resultsCountText = computed(() => {
    const total = this.meta()?.total ?? 0;
    return this.lang.currentLang() === 'ar'
      ? `تم العثور على ${total} تقرير`
      : `Showing ${total} reports`;
  });

  constructor() {
    // Set 404 status code if category page fails to load on SSR
    effect(() => {
      const isLoaded = !this.pageResource.isLoading();
      const hasError = !!this.pageResource.error();
      const hasNoData = !this.pageData();

      if (isLoaded && (hasError || hasNoData) && this.responseInit) {
        this.responseInit.status = 404;
      }
    });

    // Sync SEO metadata and track loaded language state
    effect(() => {
      if (this.pageResource.status() !== 'resolved') {
        return;
      }
      const response = this.pageResource.value();
      if (response?.seo) {
        this.seoService.updateSeo(response.seo);
      }

      if (response) {
        const activeLang = untracked(this.lang.currentLang);
        this.loadedLang.set(activeLang);
        if (response.data.other_slug) {
          this.otherSlug.set(response.data.other_slug);
        }
      }
    });

    // Redirect to translated slug when active language changes
    effect(() => {
      const activeLang = this.lang.currentLang();
      const loadedLanguage = untracked(this.loadedLang);
      const translationSlug = untracked(this.otherSlug);

      if (loadedLanguage && activeLang !== loadedLanguage && translationSlug) {
        const basePath = untracked(this.isCategoryRoute) ? 'category' : 'topic';
        untracked(() => {
          this.loadedLang.set(null);
          this.otherSlug.set(null);
        });
        this.router.navigate(['/', activeLang, basePath, translationSlug], { replaceUrl: true });
      }
    });

    // Reset currentPage when filterVal changes
    effect(() => {
      this.filterVal();
      untracked(() => {
        if (this.currentPage() !== 1) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: undefined },
            queryParamsHandling: 'merge'
          });
        }
      });
    });

    // Reset currentPage when search query changes
    effect(() => {
      untracked(() => {
        if (this.currentPage() !== 1) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: undefined },
            queryParamsHandling: 'merge'
          });
        }
      });
    });
  }

  // Event handlers
  onFilterChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.filterVal.set(val);
  }

  setCaseStudiesView(view: 'grid' | 'list'): void {
    this.caseStudiesView.set(view);
  }

  clearCaseStudiesFilters(): void {
    this.filterVal.set('');
    this.searchQuery.set('');
  }


}
