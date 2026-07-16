import { Component, input, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { HomeService } from '@features/home/services/home.service';
import { Article } from '@core/interfaces/home.interface';
import { CaseStudiesCardComponent } from '@shared/components/case-studies-card/case-studies-card.component';
import { WriterHeaderCardComponent } from '../../components/writer-header-card/writer-header-card.component';
import { WriterBioCardComponent } from '../../components/writer-bio-card/writer-bio-card.component';

@Component({
  selector: 'app-writers-details',
  imports: [
    RouterLink,
    TranslatePipe,
    CaseStudiesCardComponent,
    WriterHeaderCardComponent,
    WriterBioCardComponent
  ],
  templateUrl: './writers-details.component.html',
  styleUrl: './writers-details.component.css'
})
export class WritersDetailsComponent {
  readonly lang = inject(LanguageService);
  private readonly homeService = inject(HomeService);

  readonly id = input.required<string>(); // Route param ':id'
  readonly activeTab = signal<'articles' | 'bio'>('articles');

  readonly authorsList = computed(() => this.homeService.homeResource.value()?.data?.authors ?? []);

  readonly author = computed(() => {
    const writers = this.authorsList();
    const currentId = Number(this.id());
    const realAuthor = writers.find(w => w.id === currentId);

    const isAr = this.lang.currentLang() === 'ar';

    // Topics / Specializations
    const topics = isAr
      ? ['الشعر', 'النقد الأدبي', 'الكتابة الإبداعية']
      : ['Poetry', 'Literary Criticism', 'Creative Writing'];

    const description = realAuthor?.description || (isAr
      ? 'شاعر وناقد أدبي وباحث في الشعر العربي الكلاسيكي والمعاصر.'
      : 'Poet, literary critic, and scholar of classical and contemporary Arabic poetry.');

    const bio = isAr
      ? 'عادل المنصور هو صوت بارز في الشعر الحر الحديث والبحور الشعرية العربية التقليدية. على مدى أكثر من عقدين من الزمان، نشر مراجعات أدبية تحلل تركيب الهياكل الشعرية الشرقية والغربية، وقام بتوجيه جيل من الشعراء الشباب من خلال ورش العمل والأعمدة النقدية.'
      : 'Adel is a prominent voice in modern free verse and traditional Arabic poetic meters. For over two decades, he has published literary reviews analyzing the synthesis of Eastern and Western poetic structures, mentoring a generation of young poets through workshops and critical columns.';

    const vision = isAr
      ? 'تتمحور رؤيته حول سد الفجوة بين التراث الشعري الكلاسيكي والأنماط المعاصرة، وإثراء المشهد الثقافي بنقود بناءة تحافظ على أصالة اللغة مع تبني التجديد.'
      : 'His vision focuses on bridging the gap between classical poetic heritage and contemporary forms, enriching the cultural landscape with constructive critiques that preserve the authenticity of the language while embracing innovation.';

    const joinedDate = isAr ? 'مايو 2023' : 'May 2023';

    // Mock articles list
    const articles: Article[] = [
      {
        id: 101,
        title: isAr ? 'التطور الصامت للشعر الحر' : 'The Silent Evolution of Free Verse',
        slug: 'silent-evolution-free-verse',
        short_text: isAr
          ? 'تحليل كيف يعيد الشعراء المعاصرون تعريف البحور التقليدية للشعر العربي الكلاسيكي للأذن الحديثة.'
          : 'Analyzing how contemporary poets are redefining the traditional meters of classical Arabic poetry for the modern ear.',
        reading_time: 7,
        published_at: '2023-05-15',
        image: {
          url: 'assets/images/fountain_pen.png',
          thumbnail: 'assets/images/fountain_pen.png'
        },
        author: {
          id: currentId,
          name: realAuthor?.name || (isAr ? 'عادل المنصور' : 'Adel Al-Mansour'),
          image: realAuthor?.image || null
        },
        topic: {
          id: 1,
          name: isAr ? 'النقد الأدبي' : 'Literary Criticism',
          slug: 'literary-criticism'
        }
      }
    ];

    return {
      id: currentId,
      name: realAuthor?.name || (isAr ? 'عادل المنصور' : 'Adel Al-Mansour'),
      image: realAuthor?.image || null,
      description: description,
      bio: bio,
      vision: vision,
      joinedDate: joinedDate,
      socials: {
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com'
      },
      topics: topics,
      articles: articles
    };
  });

  selectTab(tab: 'articles' | 'bio') {
    this.activeTab.set(tab);
  }
}
