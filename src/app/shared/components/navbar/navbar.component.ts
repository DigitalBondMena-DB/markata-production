import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  readonly lang = inject(LanguageService);

  // Router Options
  readonly navExact = { exact: true };

  // Mock SVG Icons or text content
  readonly iconSearch = '🔍';
  readonly iconBookmarks = '🔖';

  // Dynamic Ticker Strings
  readonly tickerEn = 'Exciting updates coming soon to Markata! Stay tuned.';
  readonly tickerAr = 'تحديثات مثيرة قادمة قريباً إلى ماركاتا! تابعونا.';

  // Ramadan special tab text
  readonly ramadanEn = 'Ramadan Edition';
  readonly ramadanAr = 'نسخة رمضان';
}
