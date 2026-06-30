import { inject, Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { LanguageService } from '@core/services/language.service';
import { ArticleDetailsResponse } from '@core/interfaces/article-page.interface';
import { environment } from '@env/environment';
import { ApiEndpoints } from '@core/enums/api-endpoints.enum';

@Injectable({
  providedIn: 'root'
})
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
}
