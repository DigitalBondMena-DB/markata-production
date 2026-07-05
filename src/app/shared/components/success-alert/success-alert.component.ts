import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-success-alert',
  imports: [],
  templateUrl: './success-alert.component.html',
  styleUrl: './success-alert.component.css'
})
export class SuccessAlertComponent {
  readonly title = input.required<string>();
  readonly message = input.required<string>();

  readonly confirm = output<void>();

  onConfirm(): void {
    this.confirm.emit();
  }
}
