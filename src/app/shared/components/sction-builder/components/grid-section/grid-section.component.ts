import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MarkataImageDirective } from '../../../../directives/markata-image.directive';
import { CategoryWithArticles } from '../../../../../core/interfaces/home.interface';
import { LanguageService } from '../../../../../core/services/language.service';

@Component({
  selector: 'app-grid-section',
  imports: [RouterLink, NgOptimizedImage, TranslatePipe, MarkataImageDirective],
  templateUrl: './grid-section.component.html',
  styleUrl: './grid-section.component.css',
})
export class GridSectionComponent {
  readonly lang = inject(LanguageService);
  readonly data = input.required<CategoryWithArticles>();
}

