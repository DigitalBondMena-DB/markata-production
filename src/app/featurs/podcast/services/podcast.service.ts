import { inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { BroadcastsResponse } from '../interfaces/podcast.interface';

@Service()
export class PodcastService {
    private readonly http = inject(HttpClient);
    private readonly storageKey = 'markata-podcast-saved';
    readonly ids = signal<Set<string>>(new Set(this.readStorage()));

    private readStorage(): string[] {
        try {
            const raw = localStorage.getItem(this.storageKey);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    private persist(next: Set<string>): void {
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

    getBroadcasts(page = 1): Observable<BroadcastsResponse> {
        return this.http.get<BroadcastsResponse>(`${environment.api}broadcasts?page=${page}`);
    }
}
