import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarkataImgPlaceholderDirective } from '../../../../directives/markata-img-placeholder.directive';
import { CategoryWithArticles } from '../../../../../core/interfaces/home.interface';
import { LanguageService } from '../../../../../core/services/language.service';
import { ImageUrlPipe } from '../../../../pipes/image-url.pipe';

@Component({
  selector: 'app-card-section',
  imports: [RouterLink, MarkataImgPlaceholderDirective, ImageUrlPipe],
  templateUrl: './card-section.component.html',
  styleUrl: './card-section.component.css',
})
export class CardSectionComponent {
  readonly lang = inject(LanguageService);
  readonly data = input.required<CategoryWithArticles>();
}

