import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { MarkataImageDirective } from '@shared/directives/markata-image.directive';
import { LanguageService } from '@core/services/language.service';
import { Article } from '@core/interfaces/home.interface';

@Component({
  selector: 'app-campaign-intelligence-section',
  imports: [RouterLink, NgOptimizedImage, MarkataImageDirective],
  templateUrl: './campaign-intelligence-section.component.html',
  styleUrl: './campaign-intelligence-section.component.css',
})
export class CampaignIntelligenceSectionComponent {
  readonly lang = inject(LanguageService);
  readonly articles = input.required<Article[]>();
}

