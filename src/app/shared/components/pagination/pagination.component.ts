import { Component, computed, input, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';

export interface PaginationItem {
  type: 'page' | 'ellipsis';
  value: number;
}

@Component({
  selector: 'app-pagination',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  readonly lang = inject(LanguageService);

  readonly currentPage = input.required<number>();
  readonly lastPage = input.required<number>();

  // The base route array for routerLink, e.g. ['/', lang, 'category', slug]
  readonly routeConfig = input.required<any[]>();

  // The query parameters object to merge with, e.g. { search: 'foo' }
  readonly queryParams = input<Record<string, any>>({});

  // Generates the pagination array with corner cases (ellipses)
  readonly pages = computed<PaginationItem[]>(() => {
    const current = this.currentPage();
    const last = this.lastPage();
    const items: PaginationItem[] = [];

    // Always show first page
    items.push({ type: 'page', value: 1 });

    if (current > 3) {
      items.push({ type: 'ellipsis', value: -1 });
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(last - 1, current + 1);

    for (let i = start; i <= end; i++) {
      items.push({ type: 'page', value: i });
    }

    if (current < last - 2) {
      items.push({ type: 'ellipsis', value: -2 });
    }

    // Always show last page if > 1
    if (last > 1) {
      items.push({ type: 'page', value: last });
    }

    return items;
  });

  getQueryParams(page: number): Record<string, any> {
    return { ...this.queryParams(), page };
  }
}
