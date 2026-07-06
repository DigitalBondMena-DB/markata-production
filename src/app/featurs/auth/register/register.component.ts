import { Component, signal, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { email, form, FormField, minLength, required, validate } from '@angular/forms/signals';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';
import { AuthModalComponent } from '../../../shared/components/auth-modal/auth-modal.component';
import { TranslatePipe } from '@ngx-translate/core';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register',
  imports: [FormInputComponent, AuthModalComponent, TranslatePipe, FormField],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  readonly lang = inject(LanguageService);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly errorMessage = signal<string | null>(null);
  readonly formErrors = signal<Record<string, string[]> | null>(null);

  registerModel = signal<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  readonly registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.name, { message: 'VALIDATION.NAME_REQUIRED' });
    required(schemaPath.email, { message: 'VALIDATION.EMAIL_REQUIRED' });
    email(schemaPath.email, { message: 'VALIDATION.EMAIL_INVALID' });
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

  closeModal(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    if (this.registerForm().valid() && !this.authService.loading()) {
      this.errorMessage.set(null);
      this.formErrors.set(null);

      const model = this.registerModel();
      const payload = {
        name: model.name,
        email: model.email,
        password: model.password,
        password_confirmation: model.confirmPassword
      };

      this.authService.register(payload).subscribe({
        next: () => {
          const lang = this.lang.currentLang();
          this.router.navigate([lang]);
        },
        error: (err) => {
          console.error('Registration failed:', err);
          this.errorMessage.set(err.error?.message ?? 'Registration failed.');
          this.formErrors.set(err.error?.errors ?? null);
        }
      });
    }
  }
}
