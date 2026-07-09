import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { NewsletterSubscribeResponse } from '../interfaces/newsletter.interface';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private readonly http = inject(HttpClient);

  subscribe(email: string): Observable<NewsletterSubscribeResponse> {
    return this.http.post<NewsletterSubscribeResponse>(
      `${environment.api}subscribe`,
      { email }
    );
  }
}
