import { inject, Service } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { environment } from '@env/environment';
import { FavoritesResponse } from '../interfaces/profile.interface';
import { LanguageService } from '@core/services/language.service';
import { Observable } from 'rxjs';

@Service()
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly langService = inject(LanguageService);

  getFavorites(page: () => number) {
    return httpResource<FavoritesResponse>(() => {
      const pageNum = page();
      const lang = this.langService.currentLang();
      return {
        url: `${environment.api}favorites?page=${pageNum}`,
        headers: {
          'Accept-Language': lang
        }
      };
    });
  }

  addFavorite(id: number): Observable<void> {
    const lang = this.langService.currentLang();
    return this.http.post<void>(`${environment.api}favorites/${id}`, null, {
      headers: {
        'Accept-Language': lang
      }
    });
  }

  deleteFavorite(id: number): Observable<void> {
    const lang = this.langService.currentLang();
    return this.http.delete<void>(`${environment.api}favorites/${id}`, {
      headers: {
        'Accept-Language': lang
      }
    });
  }
}
