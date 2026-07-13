import { Component, input, output, inject } from '@angular/core';
import { NgOptimizedImage, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Broadcast } from '../../interfaces/podcast.interface';
import { MarkataImageDirective } from '../../../../shared/directives/markata-image.directive';
import { BookmarkButtonComponent } from '@shared/components/bookmark-button/bookmark-button.component';
import { LanguageService } from '@core/services/language.service';

@Component({
  selector: 'app-broadcast-card',
  imports: [NgOptimizedImage, TranslatePipe, MarkataImageDirective, DatePipe, BookmarkButtonComponent, RouterLink],
  templateUrl: './broadcast-card.component.html',
  styleUrl: './broadcast-card.component.css'
})
export class BroadcastCardComponent {
  readonly broadcast = input.required<Broadcast>();
  readonly layout = input<'feature' | 'card'>('card');
  readonly play = output<string>();
  readonly favoriteChanged = output<{ id: number; isFavorite: boolean }>();

  readonly lang = inject(LanguageService);

  onFavoriteChanged(event: { id: number; isFavorite: boolean }) {
    this.broadcast().is_favorite = event.isFavorite;
    this.favoriteChanged.emit(event);
  }

  onPlayClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.broadcast().video_url) {
      this.play.emit(this.broadcast().video_url!);
    }
  }
}
