import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { AuthService } from '@core/services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { ProfileHeaderComponent } from '../../components/profile-header/profile-header.component';
import { ProfileSavedComponent } from '../../components/profile-saved/profile-saved.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ProfileHeaderComponent, ProfileSavedComponent],
  providers: [ProfileService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly profileService = inject(ProfileService);

  // Read current user details from AuthService
  readonly currentUser = computed(() => this.authService.currentUser());

  // Page number driven by queryParams
  readonly page = toSignal(
    this.route.queryParams.pipe(
      map(params => {
        const p = Number(params['page']);
        return isNaN(p) || p < 1 ? 1 : p;
      })
    ),
    { initialValue: 1 }
  );

  // Load favorites list reactively
  readonly favoritesResource = this.profileService.getFavorites(() => this.page());

  // Computed signals mapping the response data
  readonly favoritesResponse = computed(() => this.favoritesResource.value());
  readonly favorites = computed(() => this.favoritesResponse()?.data ?? []);
  readonly totalCount = computed(() => this.favoritesResponse()?.meta?.total ?? 0);
  readonly currentPage = computed(() => this.favoritesResponse()?.meta?.current_page ?? 1);
  readonly lastPage = computed(() => this.favoritesResponse()?.meta?.last_page ?? 1);

  onRemoveFavorite(id: number): void {
    // Reload resource list reactively. The API delete request was already completed by the BookmarkButtonComponent.
    this.favoritesResource.reload();
  }
}
