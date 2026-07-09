import { Component, input, output, signal, inject } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-server-error-popup',
  imports: [],
  templateUrl: './server-error-popup.component.html',
  styleUrl: './server-error-popup.component.css'
})
export class ServerErrorPopupComponent {
  readonly lang = inject(LanguageService);
  readonly error = input.required<any>();
  readonly close = output<void>();

  readonly showDetails = signal(false);

  toggleDetails(): void {
    this.showDetails.update(v => !v);
  }

  retryPage(): void {
    window.location.reload();
  }

  getExceptionMessage(): string {
    const err = this.error();
    if (err?.error?.message) {
      return err.error.message;
    }
    if (err?.message) {
      return err.message;
    }
    return 'An unexpected server error occurred.';
  }

  getExceptionDetails(): { exception?: string; file?: string; line?: number } | null {
    const err = this.error()?.error;
    if (err && (err.exception || err.file || err.line)) {
      return {
        exception: err.exception,
        file: err.file,
        line: err.line
      };
    }
    return null;
  }
}
