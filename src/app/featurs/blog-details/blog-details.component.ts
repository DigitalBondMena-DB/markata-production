import { Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { MarkataImgPlaceholderDirective } from '../../shared/directives/markata-img-placeholder.directive';

@Component({
  selector: 'app-blog-details',
  imports: [RouterLink, TranslatePipe, MarkataImgPlaceholderDirective],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class BlogDetailsComponent {
  readonly lang = inject(LanguageService);

  readonly socialXGlyph = '𝕏';

  shareStub(event: Event): void {
    event.preventDefault();
  }

  facebookShareHref(): string {
    return 'https://facebook.com';
  }

  twitterShareHref(): string {
    return 'https://x.com';
  }

  linkedinShareHref(): string {
    return 'https://linkedin.com';
  }

  copyArticleLink(event: Event): void {
    event.preventDefault();
    navigator.clipboard.writeText(window.location.href);
  }
}
