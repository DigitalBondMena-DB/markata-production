import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgOptimizedImage } from '@angular/common';
import { MarkataImageDirective } from '@shared/directives/markata-image.directive';
import { LanguageService } from '@core/services/language.service';
import { Article } from '@core/interfaces/home.interface';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-hero-seciton',
  imports: [TranslatePipe, NgOptimizedImage, MarkataImageDirective, RouterLink, SkeletonComponent],
  templateUrl: './hero-seciton.component.html',
  styleUrl: './hero-seciton.component.css',
})
export class HeroSecitonComponent {
  readonly lang = inject(LanguageService);
  readonly articles = input.required<Article[]>();
  readonly isLoading = input<boolean>(false);
}

