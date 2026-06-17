import { inject, Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { LanguageService } from '../../core/services/language.service';
import { SocialResponse } from '../../core/interfaces/social.interface';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../../core/enums/api-endpoints.enum';

@Injectable({
  providedIn: 'root',
})
export class SocialService {
  private readonly langService = inject(LanguageService);

  readonly socialResource = httpResource<SocialResponse>(() => {
    const lang = this.langService.currentLang();
    return {
      url: `${environment.api}${ApiEndpoints.SOCIAL}`,
      headers: {
        'Accept-Language': lang,
      },
    };
  });
}
