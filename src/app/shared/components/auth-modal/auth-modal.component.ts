import { Component, input, output } from '@angular/core';
import { MainInnerHeaderComponent } from "../main-inner-header/main-inner-header.component";

@Component({
  selector: 'app-auth-modal',
  imports: [MainInnerHeaderComponent],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css'
})
export class AuthModalComponent {
  readonly badge = input<string>('');
  readonly modalTitle = input<string>('');
  readonly subtitle = input.required<string>();
  readonly footerText = input<string>('');

  readonly close = output<void>();
  readonly footerClick = output<void>();

  closeModal(): void {
    this.close.emit();
  }

  onFooterClick(): void {
    this.footerClick.emit();
  }
}
