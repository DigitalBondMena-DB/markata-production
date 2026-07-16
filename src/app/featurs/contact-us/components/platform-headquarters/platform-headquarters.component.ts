import { Component, inject, computed } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';

interface ContactItem {
  iconType: 'address' | 'email' | 'phone';
  title: string;
  items: string[];
}

@Component({
  selector: 'app-platform-headquarters',
  imports: [TranslatePipe],
  templateUrl: './platform-headquarters.component.html',
  styleUrl: './platform-headquarters.component.css'
})
export class PlatformHeadquartersComponent {
  readonly lang = inject(LanguageService);

  readonly contactDetails = computed<ContactItem[]>(() => {
    const isAr = this.lang.currentLang() === 'ar';
    return [
      {
        iconType: 'address',
        title: isAr ? 'المقر الرئيسي للمنصة' : 'Address',
        items: [
          isAr
            ? '١٢ ميدان طلعت حرب، باب اللوق، عابدين، محافظة القاهرة، مصر'
            : '12 Talaat Harb Square, Bab Al Louq, Abdeen, Cairo Governorate, Egypt',
          isAr
            ? 'فرع الجيزة: ٤٥ شارع الملك الصالح، الجيزة، مصر'
            : 'Giza Branch: 45 El-Malek El-Saleh St, Giza, Egypt'
        ]
      },
      {
        iconType: 'email',
        title: isAr ? 'البريد الإلكتروني' : 'Emails',
        items: [
          'hello@mrkata.com',
          'writers@mrkata.com'
        ]
      },
      {
        iconType: 'phone',
        title: isAr ? 'الهاتف' : 'Phone',
        items: [
          isAr ? '+2 010xxxxxxxx' : '+2 010xxxxxxxx',
        ]
      }
    ];
  });
}
