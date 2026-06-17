import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarkataImgPlaceholderDirective } from '../../../../directives/markata-img-placeholder.directive';
import { CategoryWithArticles } from '../../../../../core/interfaces/home.interface';
import { LanguageService } from '../../../../../core/services/language.service';

@Component({
  selector: 'app-list-section',
  imports: [RouterLink, MarkataImgPlaceholderDirective],
  templateUrl: './list-section.component.html',
  styleUrl: './list-section.component.css',
})
export class ListSectionComponent {
  readonly lang = inject(LanguageService);
  readonly data = input.required<CategoryWithArticles>();
}

