import { Component, computed, DOCUMENT, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { LanguageService } from '@core/services/language.service';
import { NgOptimizedImage } from '@angular/common';
import { MarkataImageDirective } from "@shared/directives/markata-image.directive";
import { PodcastService } from './services/podcast.service';
import { RouterLink } from '@angular/router';
import { timer } from 'rxjs';

@Component({
  selector: 'app-podcast',
  imports: [NgOptimizedImage, MarkataImageDirective, RouterLink],
  templateUrl: './podcast.component.html',
  styleUrl: './podcast.component.css',
})
export class PodcastComponent {
  private readonly doc = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  readonly lang = inject(LanguageService);
  readonly saved = inject(PodcastService);

  readonly episodes = [
    {
      id: 'ep-mena-masterclass',
      desk: 'strategy',
      layout: 'feature',
      href: '/',
      duration: '42:15',
      categoryEn: 'Strategy',
      categoryAr: 'الاستراتيجية',
      titleEn: 'The masterclass: navigating global markets from MENA',
      titleAr: 'الدرس التطبيقي: التنقل في الأسواق العالمية انطلاقاً من الشرق الأوسط',
      excerptEn:
        'Geopolitical shifts, retail media, and the fiscal signals multinational teams watch from Dubai and Cairo.',
      excerptAr: 'تحولات جيوسياسية، وإعلام بيعي، وإشارات مالية يراقبها فرق الشركات متعددة الجنسيات من دبي والقاهرة.',
      imgSeed: 'markata-pod-bento-feature',
      dateEn: '24 Oct 2024',
      dateAr: '\u0662\u0664 \u0623\u0643\u062a\u0648\u0628\u0631 \u0662\u0660\u0662\u0664',
    },
    {
      id: 'ep-gen-workflows',
      desk: 'ai',
      layout: 'card',
      href: '/',
      duration: '28:04',
      categoryEn: 'AI future',
      categoryAr: 'مستقبل الذكاء الاصطناعي',
      categoryVariant: 'accent',
      titleEn: 'Generative workflows without the theatre',
      titleAr: 'سير عمل توليدية بلا مبالغة',
      imgSeed: 'markata-pod-bento-1',
    },
    {
      id: 'ep-artisans',
      desk: 'creativity',
      layout: 'card',
      href: '/',
      duration: '35:50',
      categoryEn: 'Culture',
      categoryAr: 'الثقافة',
      categoryVariant: 'muted',
      titleEn: 'Modern artisans: craft stories from MENA shelves',
      titleAr: 'حرفيون معاصرون: قصص حِرف من رفوف الشرق الأوسط',
      imgSeed: 'markata-pod-bento-2',
    },
    {
      id: 'ep-hyper-personal',
      desk: 'branding',
      layout: 'card',
      href: '/',
      duration: '19:22',
      categoryEn: 'Branding',
      categoryAr: 'العلامات',
      titleEn: 'Identity in the age of hyper-personalization',
      titleAr: 'الهوية في زمن فرط التخصيص',
      imgSeed: 'markata-pod-bento-3',
    },
    {
      id: 'ep-liquidity',
      desk: 'strategy',
      layout: 'card',
      href: '/',
      duration: '54:01',
      categoryEn: 'Strategy',
      categoryAr: 'الاستراتيجية',
      titleEn: 'Liquidity narratives every CMO should pressure-test',
      titleAr: 'سرديات السيولة التي يجب أن يختبرها كل مدير تسويق',
      imgSeed: 'markata-pod-bento-4',
    },
    {
      id: 'ep-wires-dubai',
      desk: 'news',
      layout: 'card',
      href: '/',
      duration: '31:08',
      categoryEn: 'News',
      categoryAr: 'الأخبار',
      titleEn: 'Dubai wires: what changed this week',
      titleAr: 'أخبار دبي: ما الذي تغيّر هذا الأسبوع',
      imgSeed: 'markata-pod-bento-extra-1',
      paginated: true,
    },
    {
      id: 'ep-case-teardown-live',
      desk: 'cases',
      layout: 'card',
      href: '/',
      duration: '22:44',
      categoryEn: 'Case studies',
      categoryAr: 'دراسات الحالة',
      titleEn: 'Live teardown: loyalty vs. discounting',
      titleAr: 'تفكيك مباشر: الولاء مقابل التخفيضات',
      imgSeed: 'markata-pod-bento-extra-2',
      paginated: true,
    },
  ];

  /** Mirrors static `*.html` paths from the site root. */
  private readonly deskHomePath: Record<any, string> = {
    strategy: 'strategy',
    ai: 'ai-tech',
    creativity: 'creativity',
    branding: 'branding',
    news: 'news',
    cases: 'case-studies',
    topics: 'topics',
  };
  readonly selectedDesk = signal<string>('all');
  readonly revealedPaginated = signal(false);
  readonly showSkeleton = signal(true);

  readonly visibleEpisodes = computed(() => {
    const desk = this.selectedDesk();
    const rev = this.revealedPaginated();
    return this.episodes.filter((ep) => {
      if (ep.paginated && !rev) return false;
      if (desk === 'all') return true;
      if (ep.desk === 'branding') return false;
      return ep.desk === desk;
    });
  });

  readonly showLoadMore = computed(() => {
    if (this.revealedPaginated()) return false;
    return this.episodes.some((e) => e.paginated);
  });

  readonly chips: { desk: string; en: string; ar: string }[] = [
    { desk: 'all', en: 'All media', ar: 'كل المحتوى' },
    { desk: 'strategy', en: 'Strategy', ar: 'الاستراتيجية' },
    { desk: 'ai', en: 'AI & Tech', ar: 'الذكاء الاصطناعي' },
    { desk: 'creativity', en: 'Creativity', ar: 'الإبداع' },
    { desk: 'news', en: 'News', ar: 'الأخبار' },
    { desk: 'cases', en: 'Case studies', ar: 'دراسات الحالة' },
    { desk: 'topics', en: 'Topics', ar: 'المواضيع' },
  ];

  readonly sidebarTrends: {
    num: string;
    titleEn: string;
    titleAr: string;
    metaEn: string;
    metaAr: string;
    homePath: string;
  }[] = [
      {
        num: '01',
        titleEn: 'The honesty premium in Arabic copy',
        titleAr: 'علاوة الصدق في النص العربي',
        metaEn: '12k plays · Brand / Language',
        metaAr: '\u0661\u0662 \u0623\u0644\u0641 \u0627\u0633\u062a\u0645\u0627\u0639 \u00b7 \u0627\u0644\u0639\u0644\u0627\u0645\u0629 / \u0627\u0644\u0644\u063a\u0629',
        homePath: 'strategy',
      },
      {
        num: '02',
        titleEn: 'Frameworks that survive the boardroom',
        titleAr: 'أطر تعيش اجتماع مجلس الإدارة',
        metaEn: '9.5k plays · Resources',
        metaAr: '\u0669\u066b\u0665 \u0623\u0644\u0641 \u0627\u0633\u062a\u0645\u0627\u0639 \u00b7 \u0627\u0644\u0645\u0648\u0627\u0631\u062f',
        homePath: 'resources',
      },
      {
        num: '03',
        titleEn: 'GCC retail media reality check',
        titleAr: 'فحص واقع إعلام التجزئة في الخليج',
        metaEn: '8.2k plays · News',
        metaAr: '\u0668\u066b\u0662 \u0623\u0644\u0641 \u0627\u0633\u062a\u0645\u0627\u0639 \u00b7 \u0627\u0644\u0623\u062e\u0628\u0627\u0631',
        homePath: 'news',
      },
      {
        num: '04',
        titleEn: 'Ten-minute case teardown',
        titleAr: 'تفكيك دراسة حالة في عشر دقائق',
        metaEn: '7k plays · Case studies',
        metaAr: '\u0667 \u0622\u0644\u0627\u0641 \u0627\u0633\u062a\u0645\u0627\u0639 \u00b7 \u062f\u0631\u0627\u0633\u0627\u062a \u0627\u0644\u062d\u0627\u0644\u0629',
        homePath: 'case-studies',
      },
    ];

  ngOnInit(): void {
    this.doc.body.classList.add('page-markata-fm');
    this.title.setTitle('MARKATA FM — MARKATA');
    this.meta.updateTag({
      name: 'description',
      content:
        'MARKATA FM — long-form marketing intelligence for MENA. Episodes, show notes, and bilingual transcripts.',
    });
  }

  ngAfterViewInit(): void {
    timer(3000).subscribe(() => this.showSkeleton.set(false));
  }

  ngOnDestroy(): void {
    this.doc.body.classList.remove('page-markata-fm');
  }

  selectDesk(desk: string): void {
    this.selectedDesk.set(desk);
  }

  loadMore(): void {
    this.revealedPaginated.set(true);
  }

  toggleSave(ep: any, ev: Event): void {
    ev.preventDefault();
    ev.stopPropagation();
    this.saved.toggle(ep.id);
  }

  saveIcon(ep: any): string {
    return this.saved.ids().has(ep.id) ? '\u2665' : '\u2661';
  }

  homePathForEpisode(ep: any): string {
    return this.deskHomePath[ep.desk];
  }
}
