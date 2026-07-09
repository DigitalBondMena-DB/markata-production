import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { MarkataImageDirective } from '../../../../shared/directives/markata-image.directive';
import { LanguageService } from '../../../../core/services/language.service';
import { Category } from '../../../../core/interfaces/home.interface';

@Component({
  selector: 'app-discover-category-section',
  imports: [RouterLink, NgOptimizedImage, MarkataImageDirective],
  templateUrl: './discover-category-section.component.html',
  styleUrl: './discover-category-section.component.css',
})
export class DiscoverCategorySectionComponent {
  readonly lang = inject(LanguageService);
  readonly categories = input.required<Category[]>();
}

