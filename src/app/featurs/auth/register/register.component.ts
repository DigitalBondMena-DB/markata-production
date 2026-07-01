import { Component, signal, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { email, form, FormField, required, validate } from '@angular/forms/signals';
import { LanguageService } from '../../../core/services/language.service';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';
import { TranslatePipe } from '@ngx-translate/core';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register',
  imports: [FormInputComponent, TranslatePipe, FormField],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  readonly lang = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  registerModel = signal<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  readonly registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required' });
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Valid email is required' });
    required(schemaPath.password, { message: 'Password is required' });
    required(schemaPath.confirmPassword, { message: 'Confirm password is required' });

    validate(schemaPath.confirmPassword, ({ value, valueOf }) => {
      if (value() !== valueOf(schemaPath.password)) {
        return { kind: 'mismatch', message: 'Passwords must match' };
      }
      return undefined;
    });
  });

  closeModal(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    if (this.registerForm().valid()) {
      console.log('Registration data:', this.registerModel());
      this.closeModal();
    }
  }
}
