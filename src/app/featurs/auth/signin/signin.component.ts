import { Component, signal, inject } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { MainInnerHeaderComponent } from '../../../shared/components/main-inner-header/main-inner-header.component';
import { LanguageService } from '../../../core/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';

interface SignInData {
  email: string;
  password: string;
  rememberMe: boolean;
}
@Component({
  selector: 'app-signin',
  imports: [FormField, MainInnerHeaderComponent, TranslatePipe],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  readonly lang = inject(LanguageService);

  readonly showPassword = signal<boolean>(false);

  signinModel = signal<SignInData>({
    email: '',
    password: '',
    rememberMe: false
  })
  readonly signinForm = form(this.signinModel, (schemaPath) => {
    required(schemaPath.email, { message: "email is required" });
    email(schemaPath.email, { message: "valid email is required" });
    required(schemaPath.password, { message: "password is required" });
  })

  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
  }
}
