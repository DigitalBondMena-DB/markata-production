import { Component, signal, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { email, form, FormField, required } from '@angular/forms/signals';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';
import { AuthModalComponent } from '../../../shared/components/auth-modal/auth-modal.component';
import { SuccessAlertComponent } from '../../../shared/components/success-alert/success-alert.component';
import { TranslatePipe } from '@ngx-translate/core';

interface ForgotPasswordData {
  email: string;
}

@Component({
  selector: 'app-forgot-password',
  imports: [FormInputComponent, AuthModalComponent, SuccessAlertComponent, TranslatePipe, FormField],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  readonly lang = inject(LanguageService);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly showSuccess = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly formErrors = signal<Record<string, string[]> | null>(null);

  forgotPasswordModel = signal<ForgotPasswordData>({
    email: ''
  });

  readonly forgotPasswordForm = form(this.forgotPasswordModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Valid email is required' });
  });

  closeModal(): void {
    // Navigate back to signin
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    if (this.forgotPasswordForm().valid() && !this.authService.loading()) {
      this.errorMessage.set(null);
      this.formErrors.set(null);
      
      const emailVal = this.forgotPasswordModel().email;
      this.authService.forgotPassword(emailVal).subscribe({
        next: () => {
          this.showSuccess.set(true);
        },
        error: (err) => {
          console.error('Forgot password error:', err);
          this.errorMessage.set(err.error?.message ?? 'Request failed.');
          this.formErrors.set(err.error?.errors ?? null);
        }
      });
    }
  }
}
