import { Component, signal, computed, inject, input, effect, linkedSignal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { httpResource } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../shared/services/seo.service';
import { MarkataImgPlaceholderDirective } from '../../shared/directives/markata-img-placeholder.directive';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../../core/enums/api-endpoints.enum';
import { CategoryPageResponse } from '../../core/interfaces/category-page.interface';

@Component({
  selector: 'app-category',
  imports: [RouterLink, TranslatePipe, MarkataImgPlaceholderDirective],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {
  readonly lang = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly seoService = inject(SeoService);

  // Router binds the :slug parameter automatically
  readonly slug = input<string>('case-studies');

  // Track if we are on the Category route or Topic route
  readonly isCategoryRoute = computed(() => {
    return this.router.url.includes('/category');
  });

  // Filter value: reset when slug changes
  readonly filterVal = linkedSignal({
    source: this.slug,
    computation: () => ''
  });

  // Page number: reset when slug changes
  readonly currentPage = linkedSignal({
    source: this.slug,
    computation: () => 1
  });

  // Search input query
  readonly searchQuery = signal('');

  // Debounced search query in a signal way
  readonly searchQueryDebounced = toSignal(
    toObservable(this.searchQuery).pipe(
      debounceTime(300),
      distinctUntilChanged()
    ),
    { initialValue: '' }
  );

  // Layout view: grid or list
  readonly caseStudiesView = signal<'grid' | 'list'>('grid');

  // Fetch data dynamically using httpResource
  readonly pageResource = httpResource<CategoryPageResponse>(() => {
    const isCat = this.isCategoryRoute();
    const currentSlug = this.slug();
    const filter = this.filterVal();
    const query = this.searchQueryDebounced();
    const pageNum = this.currentPage();
    const activeLang = this.lang.currentLang();

    const baseEndpoint = isCat 
      ? `${ApiEndpoints.CATEGORIES}/${currentSlug}` 
      : `${ApiEndpoints.TOPICS}/${currentSlug}`;

    const params: string[] = [`page=${pageNum}`];
    if (filter) {
      if (isCat) {
        params.push(`topic=${filter}`);
      } else {
        params.push(`category=${filter}`);
      }
    }
    if (query) {
      params.push(`q=${query}`);
    }

    return {
      url: `${environment.api}${baseEndpoint}?${params.join('&')}`,
      headers: {
        'Accept-Language': activeLang
      }
    };
  });

  // Computed properties mapping the API response data
  readonly pageData = computed(() => this.pageResource.value()?.data);
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

  // Pages list helper for pagination
  readonly pages = computed(() => {
    const lastPage = this.meta()?.last_page ?? 1;
    return Array.from({ length: lastPage }, (_, i) => i + 1);
  });

  // Static strings for template translation
  readonly csf = {
    filterLabelEn: 'Filter by:',
    filterLabelAr: 'تصفية حسب:',
    viewGridLabelEn: 'Grid view',
    viewGridLabelAr: 'عرض الشبكة',
    viewListLabelEn: 'List view',
    viewListLabelAr: 'عرض القائمة',
    searchPlaceholderEn: 'Search reports...',
    searchPlaceholderAr: 'البحث عن التقارير...',
  };

  constructor() {
    // Sync SEO metadata
    effect(() => {
      const response = this.pageResource.value();
      if (response?.seo) {
        this.seoService.updateSeo(response.seo);
      }
    });

    // Reset currentPage when filterVal changes
    effect(() => {
      this.filterVal();
      this.currentPage.set(1);
    });

    // Reset currentPage when search query changes
    effect(() => {
      this.searchQueryDebounced();
      this.currentPage.set(1);
    });
  }

  // Event handlers
  onFilterChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.filterVal.set(val);
  }

  onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  setCaseStudiesView(view: 'grid' | 'list'): void {
    this.caseStudiesView.set(view);
  }

  clearCaseStudiesFilters(): void {
    this.filterVal.set('');
    this.searchQuery.set('');
  }

  changePage(page: number): void {
    if (page < 1 || page > (this.meta()?.last_page ?? 1)) return;
    this.currentPage.set(page);
  }

  caseStudiesBookmark(event: Event): void {
    event.stopPropagation();
    // Logic for bookmarking
  }
}
