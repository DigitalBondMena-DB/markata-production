import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  imports: [],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css'
})
export class EmptyStateComponent {
  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly actionText = input<string>('');
  
  readonly actionClick = output<void>();

  onActionClick(): void {
    this.actionClick.emit();
  }
}
