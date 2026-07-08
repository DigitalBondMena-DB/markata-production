import { Component, inject, input, signal, computed, effect, PLATFORM_ID, OnDestroy, untracked, Renderer2, DestroyRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '@env/environment';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-audio-player',
  imports: [TranslatePipe],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.css',
  host: {
    'class': 'app-audio-player-container',
    'role': 'region',
    '[attr.aria-label]': 'ariaLabel()'
  }
})
export class AudioPlayerComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly renderer = inject(Renderer2);

  // Inputs
  readonly audioUrl = input<string | null>(null);
  readonly title = input<string | null>(null);

  // Internal Audio Element (Browser only)
  private readonly audio = signal<HTMLAudioElement | null>(null);
  private readonly destroyRef = inject(DestroyRef);

  // Reactive State
  readonly playing = signal(false);
  readonly currentTime = signal(0);
  readonly duration = signal(0);
  readonly loading = signal(false);
  readonly volume = signal(1);
  readonly muted = signal(false);
  readonly speed = signal(1);

  // Speed options
  readonly speedOptions = [1, 1.25, 1.5, 2];

  // Computed state
  readonly progressPercent = computed(() => {
    const dur = this.duration();
    if (dur === 0) return 0;
    return (this.currentTime() / dur) * 100;
  });

  readonly formattedCurrentTime = computed(() => this.formatTime(this.currentTime()));
  readonly formattedDuration = computed(() => this.formatTime(this.duration()));
  readonly volumePercentText = computed(() => {
    if (this.muted()) return '0%';
    return `${Math.round(this.volume() * 100)}%`;
  });
  readonly ariaLabel = computed(() => {
    const audioTitle = this.title() || '';
    return `Audio Player: ${audioTitle}`;
  });

  constructor() {
    // React to audioUrl changes
    effect(() => {
      const audioUrl = this.audioUrl();
      const url = audioUrl ? `${environment.imageBaseUrl}/${audioUrl}` : null;
      if (this.isBrowser) {
        untracked(() => this.initializeAudio(url));
      }
    });

    // Sync volume to audio element
    effect(() => {
      const audioObj = this.audio();
      if (audioObj) {
        this.renderer.setProperty(audioObj, 'volume', this.volume());
      }
    });

    // Sync muted state to audio element
    effect(() => {
      const audioObj = this.audio();
      if (audioObj) {
        this.renderer.setProperty(audioObj, 'muted', this.muted());
      }
    });

    // Sync playback rate to audio element
    effect(() => {
      const audioObj = this.audio();
      if (audioObj) {
        this.renderer.setProperty(audioObj, 'playbackRate', this.speed());
      }
    });
  }



  private initializeAudio(url: string | null): void {
    this.cleanupAudio();

    if (!url) {
      this.playing.set(false);
      this.currentTime.set(0);
      this.duration.set(0);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    const audioObj = this.renderer.createElement('audio') as HTMLAudioElement;
    this.renderer.setAttribute(audioObj, 'src', url);
    this.audio.set(audioObj);


    // Event Listeners using RxJS fromEvent
    fromEvent(audioObj, 'canplay')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loading.set(false);
      });

    fromEvent(audioObj, 'loadedmetadata')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.duration.set(audioObj.duration || 0);
        this.loading.set(false);
      });

    fromEvent(audioObj, 'timeupdate')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.currentTime.set(audioObj.currentTime || 0);
      });

    fromEvent(audioObj, 'playing')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.playing.set(true);
        this.loading.set(false);
      });

    fromEvent(audioObj, 'pause')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.playing.set(false);
      });

    fromEvent(audioObj, 'ended')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.playing.set(false);
        this.currentTime.set(0);
      });

    fromEvent(audioObj, 'waiting')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loading.set(true);
      });

    fromEvent(audioObj, 'error')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loading.set(false);
        this.playing.set(false);
        console.error('Audio playback error occurred.');
      });
  }

  private cleanupAudio(): void {
    const audioObj = this.audio();
    if (audioObj) {
      audioObj.pause();
      this.renderer.setAttribute(audioObj, 'src', '');
      audioObj.load();
      this.audio.set(null);
    }
  }

  togglePlay(): void {
    const audioObj = this.audio();
    if (!audioObj) return;

    if (this.playing()) {
      audioObj.pause();
    } else {
      audioObj.play().catch(err => {
        console.error('Playback failed:', err);
      });
    }
  }

  seek(event: Event): void {
    const audioObj = this.audio();
    if (!audioObj) return;
    const inputEl = event.target as HTMLInputElement;
    const value = parseFloat(inputEl.value);
    this.renderer.setProperty(audioObj, 'currentTime', value);
    this.currentTime.set(value);
  }

  toggleMute(): void {
    this.muted.update(muted => !muted);
  }

  setVolume(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const val = parseFloat(inputEl.value);
    this.volume.set(val);
    if (val > 0 && this.muted()) {
      this.muted.set(false);
    }
  }

  cycleSpeed(): void {
    const currentSpeed = this.speed();
    const currentIndex = this.speedOptions.indexOf(currentSpeed);
    const nextIndex = (currentIndex + 1) % this.speedOptions.length;
    const nextSpeed = this.speedOptions[nextIndex];

    this.speed.set(nextSpeed);
  }

  // Keyboard accessibility
  handleKeyDown(event: KeyboardEvent): void {
    const audioObj = this.audio();
    if (!audioObj) return;

    switch (event.key) {
      case ' ':
      case 'Enter':
        event.preventDefault();
        this.togglePlay();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        // Seek backward 5 seconds
        const prevTime = Math.max(0, audioObj.currentTime - 5);
        this.renderer.setProperty(audioObj, 'currentTime', prevTime);
        break;
      case 'ArrowRight':
        event.preventDefault();
        // Seek forward 5 seconds
        const nextTime = Math.min(this.duration(), audioObj.currentTime + 5);
        this.renderer.setProperty(audioObj, 'currentTime', nextTime);
        break;
      case 'ArrowUp':
        event.preventDefault();
        // Increase volume by 10%
        const incVol = Math.min(1, this.volume() + 0.1);
        this.volume.set(incVol);
        break;
      case 'ArrowDown':
        event.preventDefault();
        // Decrease volume by 10%
        const decVol = Math.max(0, this.volume() - 0.1);
        this.volume.set(decVol);
        break;
    }
  }

  private formatTime(time: number): string {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  ngOnDestroy(): void {
    this.cleanupAudio();
  }
}
