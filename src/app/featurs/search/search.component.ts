import { Component, signal, computed, inject, ViewEncapsulation, effect, debounced } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { LanguageService } from '@core/services/language.service';
import { ArticleService } from '../article/services/article.service';
import { MarkataImgPlaceholderDirective } from '@shared/directives/markata-img-placeholder.directive';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';

@Component({
  selector: 'app-search',
  imports: [
    RouterLink,
    TranslatePipe,
    MarkataImgPlaceholderDirective,
    SkeletonComponent,
    EmptyStateComponent,
    PaginationComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent {
  readonly lang = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly titleService = inject(Title);
  private readonly articleService = inject(ArticleService);

  // Read query params as a signal
  readonly routeQueryParams = toSignal(this.route.queryParams, { initialValue: {} });

  // Page number
  readonly currentPage = computed(() => {
    const params = this.routeQueryParams() as Record<string, any>;
    const pageStr: string = params['page'] || '';
    const page: number = parseInt(pageStr, 10);
    return isNaN(page) || page < 1 ? 1 : page;
  });

  // Search input query
  searchQuery = signal('');

  // Debounced search query using native debounced() from @angular/core
  readonly searchQueryDebounced = debounced(this.searchQuery, 300);

  // Fetch search results using ArticleService
  readonly searchResource = this.articleService.searchArticles({
    q: () => this.searchQueryDebounced.value() || '',
    page: () => this.currentPage()
  });

  readonly articles = computed(() => this.searchResource.value()?.data ?? []);
  readonly meta = computed(() => this.searchResource.value()?.meta);

  constructor() {
    // Sync initial query parameter once on load
    const initialQ = this.route.snapshot.queryParams['q'] || '';
    if (initialQ) {
      this.searchQuery.set(initialQ);
    }

    // Reactively update the page title when language changes
    effect(() => {
      const isAr = this.lang.currentLang() === 'ar';
      this.titleService.setTitle(isAr ? 'ماركاتا - البحث' : 'Markata - Search');
    });

    // Update query parameter in browser address bar as search query changes
    effect(() => {
      const query = this.searchQueryDebounced.value() || '';
      const currentQ = this.route.snapshot.queryParams['q'] || '';
      if (query !== currentQ) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { q: query || null, page: 1 }, // Reset to page 1 on new search
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      }
    });
  }

}
