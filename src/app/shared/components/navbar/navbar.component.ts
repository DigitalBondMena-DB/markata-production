import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
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
  private readonly router = inject(Router);

  // Router Options
  readonly navExact = { exact: true };

  // Dynamic Ticker Strings
  readonly tickerEn = 'Exciting updates coming soon to Markata! Stay tuned.';
  readonly tickerAr = 'تحديثات مثيرة قادمة قريباً إلى ماركاتا! تابعونا.';

  // Ramadan special tab text
  readonly ramadanEn = 'Ramadan Edition';
  readonly ramadanAr = 'نسخة رمضان';

  changeLanguage(targetLang: string) {
    const segments = this.router.url.split('/');
    if (segments[1] === 'en' || segments[1] === 'ar') {
      segments[1] = targetLang;
    } else {
      segments.splice(1, 0, targetLang);
    }
    this.router.navigateByUrl(segments.join('/'));
  }
}
