import { Component, effect, inject } from '@angular/core';
import { HeroSecitonComponent } from './components/hero-seciton/hero-seciton.component';
import { DiscoverCategorySectionComponent } from "./components/discover-category-section/discover-category-section.component";
import { CampaignIntelligenceSectionComponent } from './components/campaign-intelligence-section/campaign-intelligence-section.component';
import { SctionBuilderComponent } from "../../shared/components/sction-builder/sction-builder.component";
import { SeoService } from '@shared/services/seo.service';
import { HomeService } from './services/home.service';

@Component({
  selector: 'app-home',
  imports: [HeroSecitonComponent, DiscoverCategorySectionComponent, CampaignIntelligenceSectionComponent, SctionBuilderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly homeService = inject(HomeService);
  private readonly seoService = inject(SeoService);

  readonly homeResource = this.homeService.homeResource;

  constructor() {
    effect(() => {
      const response = this.homeResource.value();
      if (response?.data?.seo) {
        this.seoService.updateSeo(response.data.seo);
      }
    });
  }
}

