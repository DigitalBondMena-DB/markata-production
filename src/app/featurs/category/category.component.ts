import { Component, signal, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { MarkataImgPlaceholderDirective } from '../../shared/directives/markata-img-placeholder.directive';

@Component({
  selector: 'app-category',
  imports: [RouterLink, TranslatePipe, MarkataImgPlaceholderDirective],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {
  readonly lang = inject(LanguageService);

  readonly slug = input<string>('case-studies');

  readonly caseStudiesIndustry = signal('all');
  readonly caseStudiesTopic = signal('all');
  readonly caseStudiesMarket = signal('all');
  readonly caseStudiesView = signal<'grid' | 'list'>('grid');
  readonly caseStudiesQuery = signal('');

  readonly page = signal({
    ctas: [
      { labelEn: 'About our methodology', labelAr: 'حول منهجيتنا', path: 'about' },
      { labelEn: 'Contact research desk', labelAr: 'اتصل بمكتب الأبحاث', path: 'contact' }
    ]
  });

  readonly csf = {
    introPrefixEn: 'Here is our collection of ',
    introPrefixAr: 'إليكم مجموعتنا من ',
    introLinkPath: 'about',
    introLinkLabelEn: 'detailed market insights',
    introLinkLabelAr: 'دراسات السوق المفصلة',
    introSuffixEn: ' and deep dives.',
    introSuffixAr: ' والتحليلات العميقة.',

    archiveKickerEn: 'MARKET INTELLIGENCE',
    archiveKickerAr: 'ذكاء السوق',
    headlineEn: 'Case Studies',
    headlineAr: 'دراسات الحالة',
    statValueEn: '45',
    statValueAr: '٤٥',
    statLabelEn: 'Published Reports',
    statLabelAr: 'تقرير منشور',

    filterLabelEn: 'Filter by:',
    filterLabelAr: 'تصفية حسب:',
    filterIndustryEn: 'Industry',
    filterIndustryAr: 'الصناعة',
    filterTopicEn: 'Topic',
    filterTopicAr: 'الموضوع',
    filterRegionEn: 'Region',
    filterRegionAr: 'المنطقة',

    viewGridLabelEn: 'Grid view',
    viewGridLabelAr: 'عرض الشبكة',
    viewListLabelEn: 'List view',
    viewListLabelAr: 'عرض القائمة',

    searchPlaceholderEn: 'Search reports...',
    searchPlaceholderAr: 'البحث عن التقارير...',

    industryOptions: [
      { id: 'all', labelEn: 'All Industries', labelAr: 'جميع الصناعات' },
      { id: 'fmcg', labelEn: 'FMCG', labelAr: 'السلع الاستهلاكية' },
      { id: 'finance', labelEn: 'Finance', labelAr: 'المالية والاستثمار' },
      { id: 'ecommerce', labelEn: 'E-Commerce', labelAr: 'التجارة الإلكترونية' },
      { id: 'luxury', labelEn: 'Luxury', labelAr: 'الفخامة والترف' },
      { id: 'tech', labelEn: 'Technology', labelAr: 'التكنولوجيا' },
    ],
    topicOptions: [
      { id: 'all', labelEn: 'All Topics', labelAr: 'جميع المواضيع' },
      { id: 'strategy', labelEn: 'Strategy', labelAr: 'الاستراتيجية' },
      { id: 'branding', labelEn: 'Branding', labelAr: 'بناء العلامة التجارية' },
      { id: 'localization', labelEn: 'Localization', labelAr: 'التوطين والمحلية' },
      { id: 'pr', labelEn: 'PR', labelAr: 'العلاقات العامة' },
      { id: 'influencer', labelEn: 'Influencer Marketing', labelAr: 'التسويق عبر المؤثرين' },
      { id: 'content', labelEn: 'Content Strategy', labelAr: 'استراتيجية المحتوى' },
    ],
    marketOptions: [
      { id: 'all', labelEn: 'All Regions', labelAr: 'جميع المناطق' },
      { id: 'egypt', labelEn: 'Egypt', labelAr: 'مصر' },
      { id: 'ksa', labelEn: 'Saudi Arabia', labelAr: 'المملكة العربية السعودية' },
      { id: 'uae', labelEn: 'UAE', labelAr: 'الإمارات العربية المتحدة' },
      { id: 'mena', labelEn: 'MENA Region', labelAr: 'الشرق الأوسط وشمال أفريقيا' },
    ],

    featured: {
      path: 'article/ramadan-emotion-art-belonging',
      imageSeed: 'markata-case-featured',
      imageAltEn: 'Ramadan Campaign Feature',
      imageAltAr: 'حملة رمضان المميزة',
      badgeFeaturedEn: 'Featured Report',
      badgeFeaturedAr: 'تقرير مميز',
      badgePdfEn: 'PDF Version',
      badgePdfAr: 'نسخة PDF',
      kickerEn: 'RAMADAN SPOTLIGHT',
      kickerAr: 'أضواء رمضان',
      titleEn: 'Emotion, Memory & the Art of Belonging in Ramadan Campaigns',
      titleAr: 'العاطفة والذاكرة وفن الانتماء في حملات رمضان',
      dekEn: 'How MENA’s leading brands designed campaigns that bypassed transactional metrics to build deep cultural resonance.',
      dekAr: 'كيف صممت كبرى العلامات التجارية في الشرق الأوسط حملات تجاوزت المقاييس التجارية لبناء صدى ثقافي عميق.',
      authorAvatarSeed: 'writer-avatar-ahmed',
      authorAltEn: 'Ahmed Al-Rashidi',
      authorAltAr: 'أحمد الرشيدي',
      authorNameEn: 'Ahmed Al-Rashidi',
      authorNameAr: 'أحمد الرشيدي',
      authorRoleEn: 'Lead Strategist',
      authorRoleAr: 'كبير الاستراتيجيين',
      readCtaEn: 'Read Case Study',
      readCtaAr: 'اقرأ دراسة الحالة',
    },

    cta: {
      path: 'sign-in',
      titleEn: 'Get custom reports delivered weekly.',
      titleAr: 'احصل على تقارير مخصصة تصلك أسبوعياً.',
      dekEn: 'Subscribe to our premium intelligence plan for direct briefs.',
      dekAr: 'اشترك في خطة الذكاء الممتازة للحصول على ملخصات مباشرة.',
      buttonEn: 'Subscribe Now',
      buttonAr: 'اشترك الآن',
    }
  };

  readonly cards = [
    {
      path: 'article/pepsi-egypt-cultural-relevance',
      imageSeed: 'indexhtml-39-data-viz',
      imageAltEn: 'Pepsi Egypt Campaign',
      imageAltAr: 'حملة بيبسي مصر',
      pdfAvailable: true,
      tone: 'gold',
      topicEn: 'Strategy',
      topicAr: 'الاستراتيجية',
      regionEn: 'Egypt',
      regionAr: 'مصر',
      titleEn: 'How Pepsi Reclaimed Market Share in Egypt Through Cultural Relevance',
      titleAr: 'كيف استعادت بيبسي حصتها السوقية في مصر من خلال الملاءمة الثقافية',
      dekEn: 'An in-depth look at Pepsi’s localization campaign that tapped into neighborhood identity.',
      dekAr: 'نظرة متعمقة على حملة بيبسي للتوطين التي استفادت من هوية الحي.',
      readTimeEn: '6 min read',
      readTimeAr: '٦ دقائق قراءة',
      industry: 'fmcg',
      topic: 'strategy',
      market: 'egypt'
    },
    {
      path: 'article/cib-digital-transformation',
      imageSeed: 'indexhtml-40-marketing-strategy',
      imageAltEn: 'CIB Tech Transformation',
      imageAltAr: 'تحول CIB الرقمي',
      pdfAvailable: false,
      tone: 'green',
      topicEn: 'Technology',
      topicAr: 'التكنولوجيا',
      regionEn: 'Egypt',
      regionAr: 'مصر',
      titleEn: "The Bank That Became a Tech Company: CIB's Digital Transformation Story",
      titleAr: 'البنك الذي أصبح شركة تقنية: قصة التحول الرقمي لـ CIB',
      dekEn: 'How Egypt’s largest private bank modernized its infrastructure to capture retail growth.',
      dekAr: 'كيف قام أكبر بنك خاص في مصر بتحديث بنيته التحتية لجذب نمو التجزئة.',
      readTimeEn: '8 min read',
      readTimeAr: '٨ دقائق قراءة',
      industry: 'finance',
      topic: 'branding',
      market: 'egypt'
    },
    {
      path: 'article/noon-ugc-community-strategy',
      imageSeed: 'indexhtml-41-brand-design',
      imageAltEn: 'Noon E-commerce Community',
      imageAltAr: 'مجتمع نون الإلكتروني',
      pdfAvailable: true,
      tone: 'violet',
      topicEn: 'Community',
      topicAr: 'المجتمع',
      regionEn: 'MENA',
      regionAr: 'الشرق الأوسط',
      titleEn: "Noon's UGC Strategy: How They Built a Community, Not Just a Customer Base",
      titleAr: 'استراتيجية المحتوى المولّد من المستخدمين لنون: كيف بنوا مجتمعاً لا قاعدة عملاء فحسب',
      dekEn: 'Analyzing the user-generated content loops that fueled Noon’s regional dominance.',
      dekAr: 'تحليل حلقات المحتوى الذي ينشئه المستخدمون والتي غذت الهيمنة الإقليمية لنون.',
      readTimeEn: '5 min read',
      readTimeAr: '٥ دقائق قراءة',
      industry: 'ecommerce',
      topic: 'localization',
      market: 'mena'
    },
    {
      path: 'article/luxury-brands-saudi-arabia',
      imageSeed: 'indexhtml-42-creative-agency',
      imageAltEn: 'Saudi Luxury Market',
      imageAltAr: 'سوق الفخامة السعودي',
      pdfAvailable: true,
      tone: 'neutral',
      topicEn: 'Luxury',
      topicAr: 'الفخامة',
      regionEn: 'Saudi Arabia',
      regionAr: 'المملكة العربية السعودية',
      titleEn: "Launching a Luxury Brand in Saudi Arabia: What Traditional Rules Don't Tell You",
      titleAr: 'إطلاق علامة تجارية فاخرة في المملكة العربية السعودية: ما لا تخبرك به القواعد التقليدية',
      dekEn: 'Understanding the shifting preferences of millennial and Gen Z Saudi luxury consumers.',
      dekAr: 'فهم التفضيلات المتغيرة لمستهلكي الفخامة السعوديين من جيل الألفية والجيل زد.',
      readTimeEn: '9 min read',
      readTimeAr: '٩ دقائق قراءة',
      industry: 'luxury',
      topic: 'strategy',
      market: 'ksa'
    },
    {
      path: 'article/talabat-hyper-local-campaign',
      imageSeed: 'indexhtml-43-digital-tech',
      imageAltEn: 'Talabat Local Delivery',
      imageAltAr: 'توصيل طلبات المحلي',
      pdfAvailable: false,
      tone: 'gold',
      topicEn: 'Localization',
      topicAr: 'المحلية',
      regionEn: 'UAE',
      regionAr: 'الإمارات',
      titleEn: "Talabat's Hyper-Local Campaign: Turning Neighborhoods Into Brand Assets",
      titleAr: 'حملة طلبات الفائقة المحلية: تحويل الأحياء إلى أصول للعلامة التجارية',
      dekEn: 'A case study on how Talabat localized its design elements for different GCC states.',
      dekAr: 'دراسة حالة حول كيفية توطين طلبات لعناصر تصميمها في دول الخليج المختلفة.',
      readTimeEn: '7 min read',
      readTimeAr: '٧ دقائق قراءة',
      industry: 'ecommerce',
      topic: 'localization',
      market: 'uae'
    },
    {
      path: 'article/pr-recovery-accountability',
      imageSeed: 'indexhtml-44-business-meeting',
      imageAltEn: 'PR Accountability Crisis',
      imageAltAr: 'أزمة المساءلة في العلاقات العامة',
      pdfAvailable: true,
      tone: 'green',
      topicEn: 'PR',
      topicAr: 'العلاقات العامة',
      regionEn: 'MENA',
      regionAr: 'الشرق الأوسط',
      titleEn: 'When the Product Fails: A PR Case Study in Accountability and Recovery',
      titleAr: 'حين يفشل المنتج: دراسة حالة في العلاقات العامة حول المساءلة والتعافي',
      dekEn: 'Lessons from a major logistics brand that turned a service outage into a trust-builder.',
      dekAr: 'الدروس المستفادة من علامة تجارية لوجستية كبرى حولت انقطاع الخدمة لبناء الثقة.',
      readTimeEn: '6 min read',
      readTimeAr: '٦ دقائق قراءة',
      industry: 'tech',
      topic: 'pr',
      market: 'mena'
    },
    {
      path: 'article/micro-influencer-beauty-brand-growth',
      imageSeed: 'indexhtml-45-mena-retail',
      imageAltEn: 'Influencer Marketing Beauty',
      imageAltAr: 'التسويق عبر المؤثرين للتجميل',
      pdfAvailable: true,
      tone: 'violet',
      topicEn: 'Influencer',
      topicAr: 'التأثير',
      regionEn: 'UAE',
      regionAr: 'الإمارات',
      titleEn: "The Micro-Influencer Bet That Paid Off: A Beauty Brand's Path to 10x Growth",
      titleAr: 'رهان المؤثرين الصغار الذي نجح: مسيرة علامة جمال نحو نمو عشرة أضعاف',
      dekEn: 'How focusing on high-engagement creators outperformed celebrity endorsements.',
      dekAr: 'كيف تفوّق التركيز على منشئي المحتوى ذوي التفاعل العالي على تأييد المشاهير.',
      readTimeEn: '7 min read',
      readTimeAr: '٧ دقائق قراءة',
      industry: 'luxury',
      topic: 'influencer',
      market: 'uae'
    },
    {
      path: 'article/long-form-publisher-retention',
      imageSeed: 'indexhtml-46-cairo-studio',
      imageAltEn: 'Long Form Content Strategy',
      imageAltAr: 'استراتيجية المحتوى الطويل',
      pdfAvailable: false,
      tone: 'neutral',
      topicEn: 'Content',
      topicAr: 'المحتوى',
      regionEn: 'Egypt',
      regionAr: 'مصر',
      titleEn: 'Long-Form in a Short-Form World: How One Publisher Doubled Retention',
      titleAr: 'المحتوى الطويل في عالم قصير: كيف ضاعف ناشر واحد معدل الاحتفاظ',
      dekEn: 'How a digital publisher rejected clickbait to build high-value subscriber loyalty.',
      dekAr: 'كيف رفض ناشر رقمي الإثارة الرخيصة لبناء ولاء المشتركين ذوي القيمة العالية.',
      readTimeEn: '8 min read',
      readTimeAr: '٨ دقائق قراءة',
      industry: 'tech',
      topic: 'content',
      market: 'egypt'
    }
  ];

  readonly caseStudiesFilteredCards = computed(() => {
    const ind = this.caseStudiesIndustry();
    const top = this.caseStudiesTopic();
    const mar = this.caseStudiesMarket();
    const query = this.caseStudiesQuery().toLowerCase().trim();

    return this.cards.filter(c => {
      const matchInd = ind === 'all' || c.industry === ind;
      const matchTop = top === 'all' || c.topic === top;
      const matchMar = mar === 'all' || c.market === mar;
      const matchQuery = !query ||
        c.titleEn.toLowerCase().includes(query) ||
        c.titleAr.includes(query) ||
        c.dekEn.toLowerCase().includes(query) ||
        c.dekAr.includes(query);

      return matchInd && matchTop && matchMar && matchQuery;
    });
  });

  readonly caseStudiesResultsLine = computed(() => {
    const count = this.caseStudiesFilteredCards().length;
    return this.lang.currentLang() === 'ar'
      ? `تم العثور على ${count} تقرير`
      : `Showing ${count} reports`;
  });

  onCaseStudiesIndustryChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.caseStudiesIndustry.set(val);
  }

  onCaseStudiesTopicChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.caseStudiesTopic.set(val);
  }

  onCaseStudiesMarketChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.caseStudiesMarket.set(val);
  }

  setCaseStudiesView(view: 'grid' | 'list'): void {
    this.caseStudiesView.set(view);
  }

  onCaseStudiesSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.caseStudiesQuery.set(val);
  }

  clearCaseStudiesFilters(): void {
    this.caseStudiesIndustry.set('all');
    this.caseStudiesTopic.set('all');
    this.caseStudiesMarket.set('all');
    this.caseStudiesQuery.set('');
  }

  caseStudiesBookmark(event: Event): void {
    event.stopPropagation();
    // Logic for bookmarking
  }
}
