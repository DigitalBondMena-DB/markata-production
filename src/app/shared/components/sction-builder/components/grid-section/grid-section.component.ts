import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarkataImgPlaceholderDirective } from '../../../../directives/markata-img-placeholder.directive';
import { CategoryWithArticles } from '../../../../../core/interfaces/home.interface';
import { LanguageService } from '../../../../../core/services/language.service';
import { ImageUrlPipe } from '../../../../pipes/image-url.pipe';

@Component({
  selector: 'app-grid-section',
  imports: [RouterLink, MarkataImgPlaceholderDirective, ImageUrlPipe],
  templateUrl: './grid-section.component.html',
  styleUrl: './grid-section.component.css',
})
export class GridSectionComponent {
  readonly lang = inject(LanguageService);
  readonly data = input.required<CategoryWithArticles>();
}

