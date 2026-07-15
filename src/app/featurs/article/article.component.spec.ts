import { TestBed } from '@angular/core/testing';
import { ArticleComponent } from './article.component';
import { ArticleService } from './services/article.service';
import { LanguageService } from '@core/services/language.service';
import { SeoService } from '@shared/services/seo.service';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { RESPONSE_INIT, signal, Component, Directive, input, model, output, Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { NgOptimizedImage, DOCUMENT, DatePipe } from '@angular/common';
import { defineBilingualRoutingTests } from '@shared/testing/bilingual-routing.spec-helper';
import { environment } from '@env/environment';

// Mock components, directives and pipes to isolate ArticleComponent unit tests
@Component({ selector: 'app-skeleton', template: '<ng-content></ng-content>', standalone: true })
class MockSkeletonComponent {}

@Component({ selector: 'app-empty-state', template: '', standalone: true })
class MockEmptyStateComponent {
  readonly title = input<string>();
  readonly description = input<string>();
  readonly actionText = input<string>();
}

@Component({ selector: 'app-bookmark-button', template: '', standalone: true })
class MockBookmarkButtonComponent {
  readonly cardId = input.required<number>();
  readonly isFavorite = model.required<boolean>();
  readonly favoriteChanged = output<{ id: number; isFavorite: boolean }>();
}

@Component({ selector: 'app-audio-player', template: '', standalone: true })
class MockAudioPlayerComponent {
  readonly audioUrl = input<string>('');
  readonly title = input<string>('');
}

@Component({ selector: 'app-subscribe-form', template: '', standalone: true })
class MockSubscribeFormComponent {
  readonly variant = input<string>('');
}

@Directive({
  selector: 'img[markataImage]',
  standalone: true
})
class MockMarkataImageDirective {
  readonly markataImage = input<any>();
}

@Pipe({
  name: 'translate',
  standalone: true
})
class MockTranslatePipe implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

@Pipe({
  name: 'socialShare',
  standalone: true
})
class MockSocialSharePipe implements PipeTransform {
  transform(value: string, platform: string, shareText?: string): string {
    return `${value}?platform=${platform}`;
  }
}

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let mockRouter: any;
  let mockLanguageService: any;
  let mockSeoService: any;
  let mockArticleService: any;
  let mockResponseInit: any;
  let mockArticleResource: any;
  let mockDocument: any;
  let mockNavigator: any;

  const mockArticleResponse = {
    seo: {
      meta_title: 'Tech Article',
      meta_description: 'Detail tech article description',
      keywords: 'angular, testing',
      robots: 'index,follow'
    },
    other_slug: 'tech-article-ar',
    data: {
      id: 5,
      title: 'Testing standalone components',
      short_text: 'A guide to standalone testing',
      body: 'Testing standalone components is straightforward.',
      reading_time: 4,
      published_at: '2026-07-15T12:00:00Z',
      is_favorite: false,
      author: {
        name: 'Author Name',
        job_title: 'Software Engineer',
        image: { url: 'author-avatar.png' }
      },
      image: { url: 'hero-image.png' }
    },
    next_articles: [],
    related_articles: [],
    random_articles: []
  };

  beforeEach(async () => {
    mockRouter = {
      url: '/article/tech-article',
      navigate: vi.fn().mockImplementation(() => Promise.resolve(true))
    };

    mockLanguageService = {
      currentLang: signal('en'),
      getBrowserOrSavedLang: () => 'en',
      setLanguage: () => {},
      initLang: () => {},
      t: (en: string, ar: string) => (mockLanguageService.currentLang() === 'ar' ? ar : en)
    };

    mockSeoService = {
      updateSeo: vi.fn()
    };

    mockArticleResource = {
      value: signal<any>(undefined),
      status: signal<any>('idle'),
      isLoading: signal(false),
      error: signal<any>(undefined),
      reload: vi.fn().mockReturnValue(true)
    };

    mockArticleService = {
      getArticle: vi.fn().mockReturnValue(mockArticleResource)
    };

    mockResponseInit = {
      status: 200
    };

    if (!navigator.clipboard) {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: vi.fn().mockResolvedValue(undefined)
        },
        writable: true,
        configurable: true
      });
    } else {
      vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    }

    await TestBed.configureTestingModule({
      imports: [ArticleComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
        { provide: LanguageService, useValue: mockLanguageService },
        { provide: SeoService, useValue: mockSeoService },
        { provide: ArticleService, useValue: mockArticleService },
        { provide: RESPONSE_INIT, useValue: mockResponseInit }
      ]
    })
    .overrideComponent(ArticleComponent, {
      set: {
        imports: [
          RouterLink,
          NgOptimizedImage,
          DatePipe,
          MockTranslatePipe,
          MockSocialSharePipe,
          MockSkeletonComponent,
          MockEmptyStateComponent,
          MockBookmarkButtonComponent,
          MockAudioPlayerComponent,
          MockSubscribeFormComponent,
          MockMarkataImageDirective
        ]
      }
    })
    .compileComponents();
  });

  function createComponent(slugVal = 'tech-article') {
    const fixture = TestBed.createComponent(ArticleComponent);
    fixture.componentRef.setInput('slug', slugVal);
    component = fixture.componentInstance;
    fixture.detectChanges();
    return { component, fixture };
  }

  it('should create the component with initial defaults', () => {
    createComponent();
    expect(component).toBeTruthy();
    expect(component.copied()).toBe(false);
  });

  it('should request the correct article slug from ArticleService', () => {
    createComponent('my-custom-slug');
    expect(mockArticleService.getArticle).toHaveBeenCalled();
    const activeSlugSignal = mockArticleService.getArticle.mock.calls[0][0];
    expect(activeSlugSignal()).toBe('my-custom-slug');
  });

  it('should map articleResponse correctly to computed properties', () => {
    createComponent();
    mockArticleResource.value.set(mockArticleResponse);
    mockArticleResource.status.set('resolved');
    TestBed.tick();

    expect(component.articleData()).toEqual(mockArticleResponse.data);
    expect(component.articleBodyHtml()).toContain('Testing standalone components is straightforward.');
    expect(component.articleUrl()).toBe(`${environment.siteUrl}/en/article/tech-article`);
  });

  it('should set response status to 404 on SSR when article is not found', () => {
    mockArticleResource.status.set('error');
    mockArticleResource.isLoading.set(false);
    mockArticleResource.error.set({ message: 'Article not found' });
    
    createComponent();
    TestBed.tick();

    expect(mockResponseInit.status).toBe(404);
  });

  it('should handle copyArticleLink correctly', async () => {
    const { component: comp } = createComponent();
    mockArticleResource.value.set(mockArticleResponse);
    mockArticleResource.status.set('resolved');
    TestBed.tick();

    const mockEvent = {
      preventDefault: vi.fn()
    } as unknown as Event;

    comp.copyArticleLink(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(`${environment.siteUrl}/en/article/tech-article`);
    
    // Wait for the copy callback promise to resolve
    await Promise.resolve();
    expect(comp.copied()).toBe(true);
  });

  // Call the shared bilingual routing test suite
  defineBilingualRoutingTests({
    createComponent: (slug: string) => createComponent(slug),
    getCurrentLangSignal: () => mockLanguageService.currentLang,
    getResourceValueSignal: () => mockArticleResource.value,
    getResourceStatusSignal: () => mockArticleResource.status,
    getSeoServiceSpy: () => mockSeoService,
    getRouterSpy: () => mockRouter,
    basePath: 'article',
    mockResponseData: (lang: string, otherSlug: string, title: string) => ({
      seo: {
        meta_title: title,
        meta_description: 'Test Description',
        keywords: 'test',
        robots: 'index,follow'
      },
      other_slug: otherSlug,
      data: {
        id: 5,
        title: title,
        body: 'Body content'
      }
    })
  });
});
