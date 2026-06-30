import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MarkataImgPlaceholderDirective } from '@shared/directives/markata-img-placeholder.directive';
import { LanguageService } from '@core/services/language.service';
import { Article } from '@core/interfaces/home.interface';
import { ImageUrlPipe } from '@shared/pipes/image-url.pipe';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-hero-seciton',
  imports: [TranslatePipe, MarkataImgPlaceholderDirective, RouterLink, ImageUrlPipe, SkeletonComponent],
  templateUrl: './hero-seciton.component.html',
  styleUrl: './hero-seciton.component.css',
})
export class HeroSecitonComponent {
  readonly lang = inject(LanguageService);
  readonly articles = input.required<Article[]>();
  readonly isLoading = input<boolean>(false);
}

