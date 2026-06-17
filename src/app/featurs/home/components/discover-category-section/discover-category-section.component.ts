import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarkataImgPlaceholderDirective } from '../../../../shared/directives/markata-img-placeholder.directive';
import { LanguageService } from '../../../../core/services/language.service';
import { Category } from '../../../../core/interfaces/home.interface';
import { ImageUrlPipe } from '../../../../shared/pipes/image-url.pipe';

@Component({
  selector: 'app-discover-category-section',
  imports: [RouterLink, MarkataImgPlaceholderDirective, ImageUrlPipe],
  templateUrl: './discover-category-section.component.html',
  styleUrl: './discover-category-section.component.css',
})
export class DiscoverCategorySectionComponent {
  readonly lang = inject(LanguageService);
  readonly categories = input.required<Category[]>();
}

