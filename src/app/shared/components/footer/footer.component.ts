import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgOptimizedImage } from '@angular/common';
import { SubscribeFormComponent } from '../subscribe-form/subscribe-form.component';
import { SocialService } from '../../services/social.service';
import { MarkataImageDirective } from '../../directives/markata-image.directive';
import { NavbarService } from '../navbar/services/navbar.service';
import { LanguageService } from '@core/services/language.service';
import { SiteService } from '@core/services/site.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe, SubscribeFormComponent, NgOptimizedImage, MarkataImageDirective],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  readonly lang = inject(LanguageService);
  readonly siteService = inject(SiteService);
  readonly digitalBondImage = '<a href="https://digitalbondmena.com/" target="_blank" rel="noopener noreferrer"><img src="assets/icons/digital-bond.webp" width="20" height="20" class=" digita-bond-icon" alt="Digital Bond" loading="lazy" decoding="async" />'
  private readonly socialService = inject(SocialService);
  private readonly navbarService = inject(NavbarService);
  readonly categories = computed(() => this.navbarService.taxonomiesResource.value()?.data.categories.slice(0, 7) ?? []);
  readonly topics = computed(() => this.navbarService.taxonomiesResource.value()?.data.topics.slice(0, 7) ?? []);

  getCategoryRoute(slug: string): any[] {
    return this.navbarService.getCategoryRoute(slug);
  }

  readonly socialLinks = computed(() => {
    const data = this.socialService.socialResource.value()?.data;
    if (!data) return [];
    return [...data].sort((a, b) => a.sort_order - b.sort_order);
  });
}
