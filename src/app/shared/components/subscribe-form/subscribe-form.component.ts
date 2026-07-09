import { Component, signal, inject, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SuccessAlertComponent } from '../success-alert/success-alert.component';
import { LanguageService } from '../../../core/services/language.service';
import { NewsletterService } from '../../../core/services/newsletter.service';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Component({
  selector: 'app-subscribe-form',
  imports: [TranslatePipe, SuccessAlertComponent],
  templateUrl: './subscribe-form.component.html',
  styleUrl: './subscribe-form.component.css'
})
export class SubscribeFormComponent {
  readonly lang = inject(LanguageService);
  private readonly newsletterService = inject(NewsletterService);

  readonly variant = input<'footer' | 'article'>('footer');
  readonly email = signal('');
  readonly loading = signal(false);
  readonly showSuccess = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal<string | null>(null);

  readonly isEmailValid = computed(() => EMAIL_REGEX.test(this.email().trim()));

  onEmailInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.email.set(inputElement.value);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.isEmailValid() || this.loading()) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    this.newsletterService.subscribe(this.email().trim()).subscribe({
      next: (res) => {
        this.successMessage.set(res.message || 'You are subscribed to our newsletter.');
        this.showSuccess.set(true);
        this.email.set('');
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Subscription failed:', err);
        this.errorMessage.set(err.error?.message ?? 'Subscription failed. Please try again.');
        this.loading.set(false);
      }
    });
  }

  onSuccessConfirm(): void {
    this.showSuccess.set(false);
  }
}
