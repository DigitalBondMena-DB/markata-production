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
}
