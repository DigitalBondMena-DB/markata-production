import { Component, input } from '@angular/core';

@Component({
  selector: 'app-main-inner-header',
  templateUrl: './main-inner-header.component.html',
  styleUrl: './main-inner-header.component.css',
})
export class MainInnerHeaderComponent {
  readonly badge = input<string>('');
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly image = input<string>('');
  readonly description = input<string>('');
}
