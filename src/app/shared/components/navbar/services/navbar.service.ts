import { inject, Service } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { LanguageService } from '../../../../core/services/language.service';
import { TaxonomiesResponse } from '../../../../core/interfaces/taxonomies.interface';
import { environment } from '../../../../../environments/environment';
import { ApiEndpoints } from '../../../../core/enums/api-endpoints.enum';

@Service()
export class NavbarService {
  private readonly langService = inject(LanguageService);

  readonly taxonomiesResource = httpResource<TaxonomiesResponse>(() => {
    const lang = this.langService.currentLang();
    return {
      url: `${environment.api}${ApiEndpoints.TAXONOMIES}`,
      headers: {
        'Accept-Language': lang,
      },
    };
  });

  readonly specialCategoryRoutes: Record<string, string> = {
    'broadcast': 'podcasts'
  };

  getCategoryRoute(slug: string): any[] {
    const specialRoute = this.specialCategoryRoutes[slug];
    if (specialRoute) {
      return ['/', this.langService.currentLang(), specialRoute];
    }
    return ['/', this.langService.currentLang(), 'category', slug];
  }
}
