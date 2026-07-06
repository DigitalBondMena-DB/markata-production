import { Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';
import { NavbarService } from './services/navbar.service';
import { BreakingNewsItem } from '../../../core/interfaces/taxonomies.interface';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { AuthService } from '@core/services/auth.service';
import { UserNameCharPipe } from '@shared/pipes/user-name-char-pipe.pipe';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, UserNameCharPipe, RouterLinkActive, TranslatePipe, DropdownComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  readonly lang = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly navbarService = inject(NavbarService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly isBrowser = isPlatformBrowser(this.platformId);
  readonly showAuth = computed(() => this.isBrowser && this.authService.isAuthChecked());

  readonly navExact = { exact: true };

  readonly tickerFallbackEn = 'Exciting updates coming soon to Markata! Stay tuned.';
  readonly tickerFallbackAr = 'تحديثات مثيرة قادمة قريباً إلى ماركاتا! تابعونا.';
  readonly taxonomiesData = computed(() => this.navbarService.taxonomiesResource.value()?.data ?? null);

  readonly displayedCategories = computed(() => {
    return this.taxonomiesData()?.categories?.slice(0, 5) ?? [];
  });

  readonly moreCategories = computed(() => {
    return this.taxonomiesData()?.categories?.slice(5) ?? [];
  });

  readonly tickerText = computed(() => {
    const news = this.taxonomiesData()?.breaking_news ?? [];
    if (news.length === 0) {
      return this.lang.currentLang() === 'ar' ? this.tickerFallbackAr : this.tickerFallbackEn;
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
  logout() {
    this.authService.logout().subscribe({
      next: () => {
      }
    });
  }
}
