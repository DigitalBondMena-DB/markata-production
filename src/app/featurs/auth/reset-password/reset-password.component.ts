import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { form, FormField, minLength, required, validate } from '@angular/forms/signals';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';
import { AuthModalComponent } from '../../../shared/components/auth-modal/auth-modal.component';
import { SuccessAlertComponent } from '../../../shared/components/success-alert/success-alert.component';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-reset-password',
  imports: [FormInputComponent, AuthModalComponent, SuccessAlertComponent, TranslatePipe, FormField],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef)
  readonly lang = inject(LanguageService);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly showSuccess = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly formErrors = signal<Record<string, string[]> | null>(null);
  private email = '';
  private token = '';

  resetPasswordModel = signal<ResetPasswordData>({
    password: '',
    confirmPassword: ''
  });

  readonly resetPasswordForm = form(this.resetPasswordModel, (schemaPath) => {
    required(schemaPath.password, { message: 'VALIDATION.PASSWORD_REQUIRED' });
    minLength(schemaPath.password, 8, { message: 'VALIDATION.PASSWORD_MIN_LENGTH' });
    required(schemaPath.confirmPassword, { message: 'VALIDATION.CONFIRM_PASSWORD_REQUIRED' });

    validate(schemaPath.confirmPassword, ({ value, valueOf }) => {
      if (value() !== valueOf(schemaPath.password)) {
        return { kind: 'mismatch', message: 'VALIDATION.PASSWORDS_MISMATCH' };
      }
      return undefined;
    });
  });

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParams['email'] || '';
    this.token = this.route.snapshot.queryParams['token'] || '';
  }

  closeModal(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    if (this.resetPasswordForm().valid() && !this.authService.loading()) {
      this.errorMessage.set(null);
      this.formErrors.set(null);

      const payload = {
        email: this.email,
        token: this.token,
        password: this.resetPasswordModel().password,
        password_confirmation: this.resetPasswordModel().confirmPassword
      };

      this.authService.resetPassword(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.showSuccess.set(true);
        },
        error: (err) => {
          console.error('Reset password error:', err);
          this.errorMessage.set(err.error?.message ?? 'Reset password failed.');
          this.formErrors.set(err.error?.errors ?? null);
        }
      });
    }
  }
}
