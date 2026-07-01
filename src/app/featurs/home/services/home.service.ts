import { inject, Service } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { HomeResponse } from '@core/interfaces/home.interface';
import { LanguageService } from '@core/services/language.service';
import { environment } from '@env/environment';
import { ApiEndpoints } from '@core/enums/api-endpoints.enum';


@Service()
export class HomeService {
  private readonly langService = inject(LanguageService);

  readonly homeResource = httpResource<HomeResponse>(() => {
    const lang = this.langService.currentLang();
    return {
      url: `${environment.api}${ApiEndpoints.HOME}`,
      headers: {
        'Accept-Language': lang
      }
    };
  });
}
