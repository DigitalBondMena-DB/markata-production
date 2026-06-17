import { inject, Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { LanguageService } from './language.service';
import { HomeResponse } from '../interfaces/home.interface';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../enums/api-endpoints.enum';

@Injectable({
  providedIn: 'root'
})
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
