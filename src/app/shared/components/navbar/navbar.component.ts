import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';
import { NavbarService } from './services/navbar.service';
import { BreakingNewsItem } from '../../../core/interfaces/taxonomies.interface';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  readonly lang = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly navbarService = inject(NavbarService);

  // Router Options
  readonly navExact = { exact: true };

  // Fallback Ticker Strings
  readonly tickerEn = 'Exciting updates coming soon to Markata! Stay tuned.';
  readonly tickerAr = 'تحديثات مثيرة قادمة قريباً إلى ماركاتا! تابعونا.';

  // Ramadan special tab text
  readonly ramadanEn = 'Ramadan Edition';
  readonly ramadanAr = 'نسخة رمضان';

  readonly categories = computed(() => this.navbarService.taxonomiesResource.value()?.data?.categories ?? []);
  readonly topics = computed(() => this.navbarService.taxonomiesResource.value()?.data?.topics ?? []);
  readonly breakingNews = computed<BreakingNewsItem[]>(() => this.navbarService.taxonomiesResource.value()?.data?.breaking_news ?? []);

  readonly tickerText = computed(() => {
    const news = this.breakingNews();
    if (news.length === 0) {
      return this.lang.currentLang() === 'ar' ? this.tickerAr : this.tickerEn;
    }
    return news.map((item: BreakingNewsItem) => item.title).join(' • ');
  });

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
