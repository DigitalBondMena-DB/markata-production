import { Component, signal, inject, computed } from '@angular/core';
import { form, FormField, required, minLength } from '@angular/forms/signals';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';
import { SuccessAlertComponent } from '../../../shared/components/success-alert/success-alert.component';
import { MainInnerHeaderComponent } from '../../../shared/components/main-inner-header/main-inner-header.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-change-password',
  imports: [
    FormInputComponent,
    SuccessAlertComponent,
    MainInnerHeaderComponent,
    SkeletonComponent,
    TranslatePipe,
    FormField
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  readonly lang = inject(LanguageService);
  readonly authService = inject(AuthService);

  readonly showSuccess = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly formErrors = signal<Record<string, string[]> | null>(null);

  // Writable form model
  readonly changePasswordModel = signal({
    current_password: '',
    password: '',
    password_confirmation: ''
  });

  // Signal Form definition with validations
  readonly changePasswordForm = form(this.changePasswordModel, (schemaPath) => {
    required(schemaPath.current_password, { message: 'VALIDATION.CURRENT_PASSWORD_REQUIRED' });
    required(schemaPath.password, { message: 'VALIDATION.NEW_PASSWORD_REQUIRED' });
    minLength(schemaPath.password, 8, { message: 'VALIDATION.PASSWORD_MIN_LENGTH' });
    required(schemaPath.password_confirmation, { message: 'VALIDATION.CONFIRM_PASSWORD_REQUIRED' });
  });

  // Computed signal to track if passwords match
  readonly passwordsMatch = computed(() => {
    const model = this.changePasswordModel();
    return model.password === model.password_confirmation;
  });

  readonly isFormValid = computed(() => {
    return this.changePasswordForm().valid() && this.passwordsMatch();
  });

  // Computed to check if the form is dirty
  readonly isDirty = computed(() => {
    const model = this.changePasswordModel();
    return !!(model.current_password || model.password || model.password_confirmation);
  });

  readonly hasFormErrors = computed(() => {
    const errors = this.formErrors();
    return !!(errors && Object.keys(errors).length > 0);
  });

  readonly getFormErrorMessages = computed(() => {
    const errors = this.formErrors();
    if (!errors) return [];

    const messages: string[] = [];
    Object.entries(errors).forEach(([field, fieldErrors]) => {
      fieldErrors.forEach(err => {
        messages.push(`${err}`);
      });
    });
    return messages;
  });

  onSuccessConfirm(): void {
    this.showSuccess.set(false);
    this.changePasswordModel.set({
      current_password: '',
      password: '',
      password_confirmation: ''
    });
    this.authService.logoutLocally();
  }

  onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    if (!this.isFormValid()) return;

    if (!this.authService.loading()) {
      this.errorMessage.set(null);
      this.formErrors.set(null);

      this.authService.changePassword(this.changePasswordModel()).subscribe({
        next: () => {
          this.showSuccess.set(true);
        },
        error: (err) => {
          console.error('Password change failed:', err);
          this.errorMessage.set(err.error?.message ?? 'Password change failed. Please try again.');
          this.formErrors.set(err.error?.errors ?? null);
        }
      });
    }
  }
}
