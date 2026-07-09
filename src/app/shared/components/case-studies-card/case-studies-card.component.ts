import { Component, input, output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgOptimizedImage } from '@angular/common';
import { LanguageService } from '@core/services/language.service';
import { MarkataImageDirective } from '@shared/directives/markata-image.directive';
import { BookmarkButtonComponent } from '../bookmark-button/bookmark-button.component';

@Component({
  selector: 'app-case-studies-card',
  imports: [RouterLink, TranslatePipe, NgOptimizedImage, MarkataImageDirective, BookmarkButtonComponent],
  templateUrl: './case-studies-card.component.html',
  styleUrl: './case-studies-card.component.css',
  host: {
    'class': 'case-studies-card',
    '[class.case-studies-card--list]': "view() === 'list'"
  }
})
export class CaseStudiesCardComponent {
  readonly lang = inject(LanguageService);

  readonly card = input.required<any>();
  readonly view = input<'grid' | 'list'>('grid');
  readonly showBookmark = input<boolean>(true);

  readonly bookmarkClick = output<any>();

  onFavoriteChanged(event: { id: number; isFavorite: boolean }) {
    this.card().is_favorite = event.isFavorite;
    this.bookmarkClick.emit(event);
  }
}
