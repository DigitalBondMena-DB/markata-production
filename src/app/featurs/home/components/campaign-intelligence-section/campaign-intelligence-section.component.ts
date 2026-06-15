import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarkataImgPlaceholderDirective } from '../../../../shared/directives/markata-img-placeholder.directive';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-campaign-intelligence-section',
  imports: [RouterLink, MarkataImgPlaceholderDirective],
  templateUrl: './campaign-intelligence-section.component.html',
  styleUrl: './campaign-intelligence-section.component.css',
})
export class CampaignIntelligenceSectionComponent {
  readonly lang = inject(LanguageService);

  readonly ar = {
    rebrandingList: 'تغيير العلامة التجارية في الأزمات: 3 شركات عربية حولت الجدل إلى قيمة',
    metaVsGoogle: 'ميتا ضد جوجل في الشرق الأوسط: أين تضع العلامات التجارية ميزانياتها في 2026؟',
    antiAd: "صعود الإعلان المناهض للإعلان: لماذا يثق الجيل زد في العلامات التجارية التي لا تحاول بجد؟"
  };
}
