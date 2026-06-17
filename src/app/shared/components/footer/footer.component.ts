import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SubscribeFormComponent } from './components/subscribe-form/subscribe-form.component';
import { SocialService } from '../../services/social.service';
import { MarkataImgPlaceholderDirective } from '../../directives/markata-img-placeholder.directive';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe, SubscribeFormComponent, MarkataImgPlaceholderDirective],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  private readonly socialService = inject(SocialService);

  readonly socialLinks = computed(() => {
    const data = this.socialService.socialResource.value()?.data;
    if (!data) return [];
    return [...data].sort((a, b) => a.sort_order - b.sort_order);
  });
}
