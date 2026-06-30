import { inject, Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { LanguageService } from '@core/services/language.service';
import { CategoryPageResponse } from '@core/interfaces/category-page.interface';
import { ApiEndpoints } from '@core/enums/api-endpoints.enum';
import { environment } from '@env/environment';


export interface CategoryParams {
  isCategoryRoute: () => boolean;
  slug: () => string;
  filterVal: () => string;
  searchQueryDebounced: () => string;
  currentPage: () => number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly langService = inject(LanguageService);

  getCategoryPage(params: CategoryParams) {
    return httpResource<CategoryPageResponse>(() => {
      const isCat = params.isCategoryRoute();
      const currentSlug = params.slug();
      if (!currentSlug) return undefined;

      const filter = params.filterVal();
      const query = params.searchQueryDebounced();
      const pageNum = params.currentPage();
      const activeLang = this.langService.currentLang();

      const baseEndpoint = isCat
        ? `${ApiEndpoints.CATEGORIES}/${currentSlug}`
        : `${ApiEndpoints.TOPICS}/${currentSlug}`;

      const urlParams: string[] = [`page=${pageNum}`];
      if (filter) {
        if (isCat) {
          urlParams.push(`topic=${filter}`);
        } else {
          urlParams.push(`category=${filter}`);
        }
      }
      if (query) {
        urlParams.push(`q=${query}`);
      }

      return {
        url: `${environment.api}${baseEndpoint}?${urlParams.join('&')}`,
        headers: {
          'Accept-Language': activeLang
        }
      };
    });
  }
}
