import { inject, Service } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { LanguageService } from '@core/services/language.service';
import { ArticleDetailsResponse, ArticlesListResponse } from '@core/interfaces/article-page.interface';
import { environment } from '@env/environment';
import { ApiEndpoints } from '@core/enums/api-endpoints.enum';

@Service()
export class ArticleService {
  private readonly langService = inject(LanguageService);

  getArticle(slug: () => string | undefined) {
    return httpResource<ArticleDetailsResponse>(() => {
      const currentSlug = slug();
      const activeLang = this.langService.currentLang();

      if (!currentSlug) return undefined;

      return {
        url: `${environment.api}${ApiEndpoints.ARTICLES}/${currentSlug}`,
        headers: {
          'Accept-Language': activeLang
        }
      };
    });
  }

  searchArticles(params: { q: () => string; page: () => number }) {
    return httpResource<ArticlesListResponse>(() => {
      const query = params.q();
      const pageNum = params.page();
      const activeLang = this.langService.currentLang();

      const urlParams: string[] = [`page=${pageNum}`];
      if (query) {
        urlParams.push(`q=${query}`);
      }

      return {
        url: `${environment.api}${ApiEndpoints.ARTICLES}?${urlParams.join('&')}`,
        headers: {
          'Accept-Language': activeLang
        }
      };
    });
  }
}
