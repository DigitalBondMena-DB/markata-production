import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { email, form, FormField, required, minLength, submit } from '@angular/forms/signals';
import { FormInputComponent } from '@shared/components/form-input/form-input.component';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { ContactService } from '../../services/contact.service';

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact-form',
  imports: [FormField, FormInputComponent, TranslatePipe],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent {
  readonly lang = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly contactService = inject(ContactService);

  readonly isSubmitting = signal(false);
  readonly isSuccess = signal(false);
  readonly errorMessage = signal<string | null>(null);

  contactModel = signal<ContactData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  readonly contactForm = form(this.contactModel, (schemaPath) => {
    required(schemaPath.name, { message: 'VALIDATION.NAME_REQUIRED' });
    minLength(schemaPath.name, 3, { message: 'VALIDATION.NAME_MIN_LENGTH' });
    required(schemaPath.email, { message: 'VALIDATION.EMAIL_REQUIRED' });
    email(schemaPath.email, { message: 'VALIDATION.EMAIL_INVALID' });
    required(schemaPath.subject, { message: 'VALIDATION.SUBJECT_REQUIRED' });
    required(schemaPath.message, { message: 'VALIDATION.MESSAGE_REQUIRED' });
    minLength(schemaPath.message, 10, { message: 'VALIDATION.MESSAGE_MIN_LENGTH' });
  });

  onSubmit(event: SubmitEvent) {
    event.preventDefault();

    // Automatically marks all fields as touched before executing the action
    submit(this.contactForm, async () => {
      this.isSubmitting.set(true);
      this.errorMessage.set(null);
      this.isSuccess.set(false);

      try {
        // Mock API delivery delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        this.contactService.formSubmitted.set(true);
        this.contactForm().reset();
        
        const currentLang = this.lang.currentLang();
        this.router.navigate(['/', currentLang, 'contact-us', 'done']);
      } catch (err) {
        this.errorMessage.set(this.lang.t(
          'Failed to send message. Please try again.',
          'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.'
        ));
      } finally {
        this.isSubmitting.set(false);
      }
    });
  }
}
