import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SuccessAlertComponent } from '@shared/components/success-alert/success-alert.component';
import { LanguageService } from '@core/services/language.service';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-done',
  imports: [SuccessAlertComponent],
  template: `
    <app-success-alert
      [title]="successTitle()"
      [message]="successMsg()"
      (confirm)="onConfirm()">
    </app-success-alert>
  `
})
export class ContactDoneComponent {
  private readonly router = inject(Router);
  readonly lang = inject(LanguageService);
  private readonly contactService = inject(ContactService);

  readonly successTitle = computed(() => this.lang.t('Success', 'تم بنجاح'));
  readonly successMsg = computed(() => this.lang.t(
    'Your request has been submitted successfully.',
    'تم إرسال طلبك بنجاح.'
  ));

  onConfirm(): void {
    this.contactService.formSubmitted.set(false);
    const currentLang = this.lang.currentLang();
    this.router.navigate(['/', currentLang, 'contact-us']);
  }
}
