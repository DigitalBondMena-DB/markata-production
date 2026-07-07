import { Component, inject, input, signal, computed, effect, PLATFORM_ID, OnDestroy, untracked } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '@env/environment';

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

  // Inputs
  readonly audioUrl = input<string | null>(null);
  readonly title = input<string | null>(null);

  // Internal Audio Element (Browser only)
  private readonly audio = signal<HTMLAudioElement | null>(null);

  // Reactive State
  readonly playing = signal(false);
  readonly currentTime = signal(0);
  readonly duration = signal(0);
  readonly loading = signal(false);
  readonly volume = signal(1); // 0 to 1
  readonly muted = signal(false);
  readonly speed = signal(1); // 1, 1.25, 1.5, 2

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
    const audioTitle = this.title() || 'Audio Player';
    return `Audio Player: ${audioTitle}`;
  });

  constructor() {
    // React to audioUrl changes
    effect(() => {
      const audioUrl = this.audioUrl();
      const url = audioUrl ? `${environment.imageBaseUrl}/uploads/${audioUrl}` : null;
      console.log(url);

      if (this.isBrowser) {
        untracked(() => this.initializeAudio(url));
      }
    });

    // Sync volume to audio element
    effect(() => {
      const audioObj = this.audio();
      if (audioObj) {
        audioObj.volume = this.volume();
      }
    });

    // Sync muted state to audio element
    effect(() => {
      const audioObj = this.audio();
      if (audioObj) {
        audioObj.muted = this.muted();
      }
    });

    // Sync playback rate to audio element
    effect(() => {
      const audioObj = this.audio();
      if (audioObj) {
        audioObj.playbackRate = this.speed();
      }
    });
  }

  ngOnDestroy(): void {
    this.cleanupAudio();
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
    const audioObj = new Audio(url);
    this.audio.set(audioObj);

    // Event Listeners
    audioObj.addEventListener('canplay', () => {
      this.loading.set(false);
    });

    audioObj.addEventListener('loadedmetadata', () => {
      this.duration.set(audioObj.duration || 0);
      this.loading.set(false);
    });

    audioObj.addEventListener('timeupdate', () => {
      this.currentTime.set(audioObj.currentTime || 0);
    });

    audioObj.addEventListener('playing', () => {
      this.playing.set(true);
      this.loading.set(false);
    });

    audioObj.addEventListener('pause', () => {
      this.playing.set(false);
    });

    audioObj.addEventListener('ended', () => {
      this.playing.set(false);
      this.currentTime.set(0);
    });

    audioObj.addEventListener('waiting', () => {
      this.loading.set(true);
    });

    audioObj.addEventListener('error', () => {
      this.loading.set(false);
      this.playing.set(false);
      console.error('Audio playback error occurred.');
    });
  }

  private cleanupAudio(): void {
    const audioObj = this.audio();
    if (audioObj) {
      audioObj.pause();
      audioObj.src = '';
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
    audioObj.currentTime = value;
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
        audioObj.currentTime = prevTime;
        break;
      case 'ArrowRight':
        event.preventDefault();
        // Seek forward 5 seconds
        const nextTime = Math.min(this.duration(), audioObj.currentTime + 5);
        audioObj.currentTime = nextTime;
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
}
