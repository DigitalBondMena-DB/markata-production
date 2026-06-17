import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarkataImgPlaceholderDirective } from '../../../../shared/directives/markata-img-placeholder.directive';
import { LanguageService } from '../../../../core/services/language.service';
import { Article } from '../../../../core/interfaces/home.interface';
import { ImageUrlPipe } from '../../../../shared/pipes/image-url.pipe';

@Component({
  selector: 'app-campaign-intelligence-section',
  imports: [RouterLink, MarkataImgPlaceholderDirective, ImageUrlPipe],
  templateUrl: './campaign-intelligence-section.component.html',
  styleUrl: './campaign-intelligence-section.component.css',
})
export class CampaignIntelligenceSectionComponent {
  readonly lang = inject(LanguageService);
  readonly articles = input.required<Article[]>();
}

