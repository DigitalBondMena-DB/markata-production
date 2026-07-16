import { Component, signal, inject, computed, linkedSignal, DestroyRef } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { LanguageService } from '../../../../core/services/language.service';
import { AuthService } from '../../../../core/services/auth.service';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { SuccessAlertComponent } from '../../../../shared/components/success-alert/success-alert.component';
import { MainInnerHeaderComponent } from '../../../../shared/components/main-inner-header/main-inner-header.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    FormInputComponent,
    SuccessAlertComponent,
    MainInnerHeaderComponent,
    SkeletonComponent,
    TranslatePipe,
    FormField
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  private readonly destroyRef = inject(DestroyRef)
  readonly lang = inject(LanguageService);
  readonly authService = inject(AuthService);

  readonly showSuccess = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly formErrors = signal<Record<string, string[]> | null>(null);

  // Writable form model linked to the currentUser state in AuthService
  readonly editProfileModel = linkedSignal({
    source: () => this.authService.currentUser(),
    computation: (user) => ({
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? ''
    })
  });

  // Signal Form definition with validations
  readonly editProfileForm = form(this.editProfileModel, (schemaPath) => {
    required(schemaPath.name, { message: 'VALIDATION.NAME_REQUIRED' });
    required(schemaPath.email, { message: 'VALIDATION.EMAIL_REQUIRED' });
    email(schemaPath.email, { message: 'VALIDATION.EMAIL_INVALID' });
    required(schemaPath.phone, { message: 'VALIDATION.PHONE_REQUIRED' });
  });

  // Computed signal to track if any changes are made
  readonly isDirty = computed(() => {
    const current = this.authService.currentUser();
    const model = this.editProfileModel();
    if (!current) return false;
    return (
      model.name !== (current.name ?? '') ||
      model.email !== (current.email ?? '') ||
      model.phone !== (current.phone ?? '')
    );
  });

  onSuccessConfirm(): void {
    this.showSuccess.set(false);
  }

  onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    if (!this.isDirty()) return;

    if (this.editProfileForm().valid() && !this.authService.loading()) {
      this.errorMessage.set(null);
      this.formErrors.set(null);

      this.authService.updateProfile(this.editProfileModel()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.showSuccess.set(true);
        },
        error: (err) => {
          console.error('Profile update failed:', err);
          this.errorMessage.set(err.error?.message ?? 'Profile update failed. Please try again.');
          this.formErrors.set(err.error?.errors ?? null);
        }
      });
    }
  }
}
