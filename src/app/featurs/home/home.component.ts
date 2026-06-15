import { Component } from '@angular/core';
import { HeroSecitonComponent } from './components/hero-seciton/hero-seciton.component';
import { DiscoverCategorySectionComponent } from "./components/discover-category-section/discover-category-section.component";
import { CampaignIntelligenceSectionComponent } from './components/campaign-intelligence-section/campaign-intelligence-section.component';
import { SctionBuilderComponent } from "../../shared/components/sction-builder/sction-builder.component";

@Component({
  selector: 'app-home',
  imports: [HeroSecitonComponent, DiscoverCategorySectionComponent, CampaignIntelligenceSectionComponent, SctionBuilderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent { }
