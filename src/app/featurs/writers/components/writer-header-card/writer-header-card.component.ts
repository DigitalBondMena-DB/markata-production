import { Component, input, signal, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { MarkataImageDirective } from '@shared/directives/markata-image.directive';

@Component({
  selector: 'app-writer-header-card',
  imports: [NgOptimizedImage, TranslatePipe, MarkataImageDirective],
  templateUrl: './writer-header-card.component.html',
  styleUrl: './writer-header-card.component.css'
})
export class WriterHeaderCardComponent {
  readonly lang = inject(LanguageService);
  readonly author = input.required<any>();
  readonly isFollowed = signal(false);

  toggleFollow() {
    this.isFollowed.update(val => !val);
  }
}
