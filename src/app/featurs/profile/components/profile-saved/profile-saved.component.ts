import { Component, input, output, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CaseStudiesCardComponent } from '@shared/components/case-studies-card/case-studies-card.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { FavoriteItem } from '../../interfaces/profile.interface';
import { LanguageService } from '@core/services/language.service';

@Component({
  selector: 'app-profile-saved',
  standalone: true,
  imports: [TranslatePipe, CaseStudiesCardComponent, PaginationComponent, EmptyStateComponent],
  templateUrl: './profile-saved.component.html',
  styleUrl: './profile-saved.component.css'
})
export class ProfileSavedComponent {
  readonly lang = inject(LanguageService);

  readonly favorites = input.required<FavoriteItem[]>();
  readonly totalCount = input.required<number>();
  readonly currentPage = input.required<number>();
  readonly lastPage = input.required<number>();

  readonly removeFavorite = output<number>();

  get routeConfig(): any[] {
    return ['/', this.lang.currentLang(), 'profile'];
  }
}
