import { Component, input, model, signal, inject, output, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { LanguageService } from '@core/services/language.service';
import { ProfileService } from '../../../featurs/profile/services/profile.service';
import { AuthService } from '@core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';

@Component({
  selector: 'app-bookmark-button',
  imports: [TranslatePipe],
  templateUrl: './bookmark-button.component.html',
  styleUrl: './bookmark-button.component.css',
  providers: [ProfileService]
})
export class BookmarkButtonComponent {
  private readonly destroyRef = inject(DestroyRef)
  private readonly router = inject(Router);
  readonly lang = inject(LanguageService);
  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);

  readonly cardId = input.required<number>();
  readonly isFavorite = model.required<boolean>();
  readonly autoCallApi = input<boolean>(true);

  readonly favoriteChanged = output<{ id: number; isFavorite: boolean }>();

  readonly animatingState = signal<'none' | 'adding' | 'removing'>('none');
  readonly isLoading = signal<boolean>(false);

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/', this.lang.currentLang(), 'auth', 'signin']);
      return;
    }

    if (this.isLoading()) {
      return;
    }

    const currentStatus = this.isFavorite();
    const targetId = this.cardId();

    if (!this.autoCallApi()) {
      this.triggerLocalToggle(!currentStatus);
      return;
    }

    this.isLoading.set(true);

    if (currentStatus) {
      this.profileService.deleteFavorite(targetId)
        .pipe(finalize(() => this.isLoading.set(false)), takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.triggerLocalToggle(false);
          },
          error: (err) => {
            console.error('Failed to remove favorite:', err);
          }
        });
    } else {
      this.profileService.addFavorite(targetId)
        .pipe(finalize(() => this.isLoading.set(false)), takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.triggerLocalToggle(true);
          },
          error: (err) => {
            console.error('Failed to add favorite:', err);
          }
        });
    }
  }

  private triggerLocalToggle(nextStatus: boolean): void {
    this.animatingState.set(nextStatus ? 'adding' : 'removing');
    this.isFavorite.set(nextStatus);
    this.favoriteChanged.emit({ id: this.cardId(), isFavorite: nextStatus });
    timer(800).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.animatingState.set('none'));
  }
}
