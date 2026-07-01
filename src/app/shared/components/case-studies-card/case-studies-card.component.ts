import { Component, input, output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { MarkataImgPlaceholderDirective } from '@shared/directives/markata-img-placeholder.directive';

@Component({
  selector: 'app-case-studies-card',
  imports: [RouterLink, TranslatePipe, MarkataImgPlaceholderDirective],
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

  readonly bookmarkClick = output<Event>();

  onBookmark(event: Event) {
    event.stopPropagation();
    this.bookmarkClick.emit(event);
  }
}
