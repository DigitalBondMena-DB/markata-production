import { Component, computed, inject, signal, linkedSignal } from '@angular/core';
import { Meta, Title, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LanguageService } from '@core/services/language.service';
import { NgOptimizedImage, DecimalPipe } from '@angular/common';
import { MarkataImageDirective } from "@shared/directives/markata-image.directive";
import { PodcastService } from './services/podcast.service';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { BroadcastCardComponent } from './components/broadcast-card/broadcast-card.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { BroadcastsResponse, Broadcast } from './interfaces/podcast.interface';

@Component({
  selector: 'app-podcast',
  imports: [
    NgOptimizedImage,
    MarkataImageDirective,
    RouterLink,
    TranslatePipe,
    SkeletonComponent,
    PaginationComponent,
    BroadcastCardComponent,
    DecimalPipe
  ],
  templateUrl: './podcast.component.html',
  styleUrl: './podcast.component.css',
})
export class PodcastComponent {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly route = inject(ActivatedRoute);

  readonly lang = inject(LanguageService);
  readonly podcastService = inject(PodcastService);

  readonly routeQueryParams = toSignal(this.route.queryParams, { initialValue: {} });

  readonly currentPage = computed(() => {
    const params = this.routeQueryParams() as Record<string, any>;
    const pageStr: string = params['page'] || '';
    const page: number = parseInt(pageStr, 10);
    return isNaN(page) || page < 1 ? 1 : page;
  });

  readonly broadcastsResource = this.podcastService.getBroadcasts(() => this.currentPage());

  readonly broadcastsResponse = computed(() => {
    if (this.broadcastsResource.status() === 'resolved') {
      return this.broadcastsResource.value();
    }
    return undefined;
  });

  readonly isLoading = computed(() => this.broadcastsResource.isLoading());
  readonly error = computed(() => this.broadcastsResource.error());
  readonly sanitizedVideoUrl = signal<SafeResourceUrl | null>(null);

  readonly latest = computed(() => this.broadcastsResponse()?.data.latest || null);
  readonly broadcasts = computed(() => this.broadcastsResponse()?.data.broadcasts.data || []);
  readonly paginationMeta = computed(() => this.broadcastsResponse()?.data.broadcasts.meta || null);
  readonly featuredBroadcasts = computed(() => this.broadcastsResponse()?.data.featured_broadcasts || []);
  readonly favorites = computed(() => this.broadcastsResponse()?.data.favorites || []);
  readonly favoritesv = linkedSignal<Broadcast[], Broadcast[]>({
    source: () => this.broadcastsResponse()?.data.favorites || [],
    computation: (source) => [...source]
  });
  readonly counters = computed(() => {
    const raw = this.broadcastsResponse()?.data.counters || [];
    return [...raw].sort((a, b) => a.sort_order - b.sort_order);
  });

  constructor() {
    this.title.setTitle('MARKATA FM — MARKATA');
    this.meta.updateTag({
      name: 'description',
      content: 'MARKATA FM — long-form marketing intelligence for MENA. Episodes, show notes, and bilingual transcripts.',
    });
  }

  onFavoriteChanged(event: { id: number; isFavorite: boolean }) {
    if (event.isFavorite) {
      // Find the broadcast card data and add it to favorites list
      const broadcast = this.broadcasts().find(b => b.id === event.id);
      if (broadcast) {
        if (!this.favoritesv().some(f => f.id === event.id)) {
          this.favoritesv.update(favs => [...favs, { ...broadcast, is_favorite: true }]);
        }
      }
    } else {
      // Remove from favorites list
      this.favoritesv.update(favs => favs.filter(f => f.id !== event.id));
    }
  }

  playVideo(url: string | null): void {
    if (url) {
      this.sanitizedVideoUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
    }
  }

  closeVideo(): void {
    this.sanitizedVideoUrl.set(null);
  }
}
