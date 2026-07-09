import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { MarkataImageDirective } from '../../../../directives/markata-image.directive';
import { CategoryWithArticles } from '../../../../../core/interfaces/home.interface';
import { LanguageService } from '../../../../../core/services/language.service';

@Component({
  selector: 'app-list-section',
  imports: [RouterLink, NgOptimizedImage, MarkataImageDirective],
  templateUrl: './list-section.component.html',
  styleUrl: './list-section.component.css',
})
export class ListSectionComponent {
  readonly lang = inject(LanguageService);
  readonly data = input.required<CategoryWithArticles>();
}

