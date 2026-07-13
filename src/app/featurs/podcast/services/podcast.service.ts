import { inject, PLATFORM_ID, Service, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { BroadcastsResponse, BroadcastDetailsResponse } from '../interfaces/podcast.interface';
import { LanguageService } from '@core/services/language.service';
import { isPlatformBrowser } from '@angular/common';

@Service()
export class PodcastService {
    private readonly http = inject(HttpClient);
    private readonly langService = inject(LanguageService);
    private readonly storageKey = 'markata-podcast-saved';
    private readonly platformId = inject(PLATFORM_ID);
    private readonly isBrowser = isPlatformBrowser(this.platformId);
    readonly ids = signal<Set<string>>(new Set(this.readStorage()));

    private readStorage(): string[] {
        if (!this.isBrowser) return [];
        try {
            const raw = localStorage.getItem(this.storageKey);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    private persist(next: Set<string>): void {
        if (!this.isBrowser) return;
        localStorage.setItem(this.storageKey, JSON.stringify([...next]));
    }

    has(id: string): boolean {
        return this.ids().has(id);
    }

    toggle(id: string): void {
        const next = new Set(this.ids());
        if (next.has(id)) next.delete(id);
        else next.add(id);
        this.ids.set(next);
        this.persist(next);
    }

    getBroadcasts(page: () => number) {
        return httpResource<BroadcastsResponse>(() => {
            const pageNum = page();
            const activeLang = this.langService.currentLang();

            return {
                url: `${environment.api}broadcasts?page=${pageNum}`,
                headers: {
                    'Accept-Language': activeLang
                }
            };
        });
    }

    getBroadcastDetails(slug: () => string | undefined) {
        return httpResource<BroadcastDetailsResponse>(() => {
            const currentSlug = slug();
            const activeLang = this.langService.currentLang();

            if (!currentSlug) return undefined;

            return {
                url: `${environment.api}broadcasts/${currentSlug}`,
                headers: {
                    'Accept-Language': activeLang
                }
            };
        });
    }
}
