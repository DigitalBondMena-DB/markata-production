import { Component, signal, inject } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { MainInnerHeaderComponent } from '../../../shared/components/main-inner-header/main-inner-header.component';
import { LanguageService } from '../../../core/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterOutlet, RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';
import { AuthService } from '../../../core/services/auth.service';

interface SignInData {
  email: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-signin',
  imports: [FormField, MainInnerHeaderComponent, TranslatePipe, RouterOutlet, RouterLink, FormInputComponent],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  readonly lang = inject(LanguageService);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly errorMessage = signal<string | null>(null);
  readonly formErrors = signal<Record<string, string[]> | null>(null);

  signinModel = signal<SignInData>({
    email: '',
    password: '',
    rememberMe: false
  });

  readonly signinForm = form(this.signinModel, (schemaPath) => {
    required(schemaPath.email, { message: "email is required" });
    email(schemaPath.email, { message: "valid email is required" });
    required(schemaPath.password, { message: "password is required" });
  });

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (this.signinForm().valid() && !this.authService.loading()) {
      this.errorMessage.set(null);
      this.formErrors.set(null);

      this.authService.login(this.signinModel()).subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'];
          const lang = this.lang.currentLang();
          if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
          } else {
            this.router.navigate([lang]);
          }
        },
        error: (err) => {
          console.error('Signin failed:', err);
          this.errorMessage.set(err.error?.message ?? 'Signin failed. Please verify your credentials.');
          this.formErrors.set(err.error?.errors ?? null);
        }
      });
    }
  }
}

