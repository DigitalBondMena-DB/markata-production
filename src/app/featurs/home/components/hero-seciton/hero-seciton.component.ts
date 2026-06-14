import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MarkataImgPlaceholderDirective } from '../../../../shared/directives/markata-img-placeholder.directive';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-hero-seciton',
  imports: [TranslatePipe, MarkataImgPlaceholderDirective, RouterLink],
  templateUrl: './hero-seciton.component.html',
  styleUrl: './hero-seciton.component.css',
})
export class HeroSecitonComponent {
  readonly lang = inject(LanguageService);
}
