import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerErrorService {
  readonly hasError = signal(false);
  readonly errorDetails = signal<any>(null);

  showError(error: any): void {
    this.errorDetails.set(error);
    this.hasError.set(true);
  }

  clearError(): void {
    this.hasError.set(false);
    this.errorDetails.set(null);
  }
}
