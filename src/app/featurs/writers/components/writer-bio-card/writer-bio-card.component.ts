import { Component, input, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';

@Component({
  selector: 'app-writer-bio-card',
  imports: [TranslatePipe],
  templateUrl: './writer-bio-card.component.html',
  styleUrl: './writer-bio-card.component.css'
})
export class WriterBioCardComponent {
  readonly lang = inject(LanguageService);
  readonly author = input.required<any>();
}
