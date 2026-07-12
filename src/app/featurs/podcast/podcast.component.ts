import { Component, computed, inject, signal, OnInit, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { BroadcastsResponse } from './interfaces/podcast.interface';

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
export class PodcastComponent implements OnInit, OnDestroy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly route = inject(ActivatedRoute);

  readonly lang = inject(LanguageService);
  readonly podcastService = inject(PodcastService);

  readonly broadcastsResponse = signal<BroadcastsResponse | null>(null);
  readonly isLoading = signal(true);
  readonly error = signal<any>(null);
  readonly sanitizedVideoUrl = signal<SafeResourceUrl | null>(null);

  readonly latest = computed(() => this.broadcastsResponse()?.data.latest || null);
  readonly broadcasts = computed(() => this.broadcastsResponse()?.data.broadcasts.data || []);
  readonly paginationMeta = computed(() => this.broadcastsResponse()?.data.broadcasts.meta || null);
  readonly featuredBroadcasts = computed(() => this.broadcastsResponse()?.data.featured_broadcasts || []);
  readonly favorites = computed(() => this.broadcastsResponse()?.data.favorites || []);
  readonly favoritesv = computed(() => this.broadcastsResponse()?.data.favorites || []);
  readonly counters = computed(() => {
    const raw = this.broadcastsResponse()?.data.counters || [];
    return [...raw].sort((a, b) => a.sort_order - b.sort_order);
  });

  private routeSub?: Subscription;

  ngOnInit(): void {
    this.title.setTitle('MARKATA FM — MARKATA');
    this.meta.updateTag({
      name: 'description',
      content: 'MARKATA FM — long-form marketing intelligence for MENA. Episodes, show notes, and bilingual transcripts.',
    });

    this.routeSub = this.route.queryParams.subscribe(params => {
      const page = params['page'] ? Number(params['page']) : 1;
      this.fetchBroadcasts(page);
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  fetchBroadcasts(page: number): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.podcastService.getBroadcasts(page).subscribe({
      next: (res) => {
        this.broadcastsResponse.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch broadcasts:', err);
        this.error.set(err);
        this.isLoading.set(false);
      }
    });
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
