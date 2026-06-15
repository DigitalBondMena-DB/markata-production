import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarkataImgPlaceholderDirective } from '../../../../shared/directives/markata-img-placeholder.directive';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-discover-category-section',
  imports: [RouterLink, MarkataImgPlaceholderDirective],
  templateUrl: './discover-category-section.component.html',
  styleUrl: './discover-category-section.component.css',
})
export class DiscoverCategorySectionComponent {
  readonly lang = inject(LanguageService);
}
