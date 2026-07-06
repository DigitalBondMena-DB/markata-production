import { Component, input, model, output, signal, computed } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.css'
})
export class FormInputComponent implements FormValueControl<string> {
  // Required by FormValueControl
  readonly value = model<string>('');

  // Automatically bound by parent [formField]
  readonly touched = input<boolean>(false);
  readonly invalid = input<boolean>(false);
  readonly errors = input<readonly any[]>([]);
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);

  // Touch output to notify parent form on blur
  readonly touch = output<void>();

  // Input configuration properties
  readonly label = input<string>('');
  readonly type = input<string>('text');
  readonly id = input<string>('');
  readonly placeholder = input<string>('');
  readonly showPasswordToggle = input<boolean>(false);

  // Visibility toggle state for password input types
  readonly showPassword = signal<boolean>(false);

  readonly inputType = computed(() => {
    if (this.type() === 'password' && this.showPasswordToggle()) {
      return this.showPassword() ? 'text' : 'password';
    }
    return this.type();
  });

  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
  }

  onBlur(): void {
    this.touch.emit();
  }
}
