import { TestBed } from '@angular/core/testing';
import { CategoryComponent } from './category.component';
import { CategoryService, CategoryParams } from './services/category.service';
import { LanguageService } from '@core/services/language.service';
import { SeoService } from '@shared/services/seo.service';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { RESPONSE_INIT, signal, Component, Directive, input, model, output, EventEmitter, Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { NgOptimizedImage } from '@angular/common';
import { defineBilingualRoutingTests } from '@shared/testing/bilingual-routing.spec-helper';

// Mock components and directives to isolate the CategoryComponent unit tests
@Component({ selector: 'app-skeleton', template: '<ng-content></ng-content>', standalone: true })
class MockSkeletonComponent { }

@Component({ selector: 'app-empty-state', template: '', standalone: true })
class MockEmptyStateComponent {
  readonly title = input<string>();
  readonly description = input<string>();
  readonly actionText = input<string>();
  readonly actionClick = output<void>();
}

@Component({ selector: 'app-pagination', template: '', standalone: true })
class MockPaginationComponent {
  readonly currentPage = input<number>(1);
  readonly lastPage = input<number>(1);
  readonly routeConfig = input<any[]>([]);
  readonly queryParams = input<any>({});
}

@Component({ selector: 'app-case-studies-card', template: '', standalone: true })
class MockCaseStudiesCardComponent {
  readonly card = input<any>();
  readonly view = input<'grid' | 'list'>('grid');
  readonly showBookmark = input<boolean>(false);
}

@Component({ selector: 'app-main-inner-header', template: '', standalone: true })
class MockMainInnerHeaderComponent {
  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly badge = input<string>('');
}

@Component({ selector: 'app-bookmark-button', template: '', standalone: true })
class MockBookmarkButtonComponent {
  readonly cardId = input.required<number>();
  readonly isFavorite = model.required<boolean>();
  readonly favoriteChanged = output<{ id: number; isFavorite: boolean }>();
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

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let queryParamsSubject: BehaviorSubject<any>;
  let mockRouter: any;
  let mockLanguageService: any;
  let mockSeoService: any;
  let mockCategoryService: any;
  let mockResponseInit: any;
  let mockPageResource: any;

  const mockCategoryResponse = {
    seo: {
      meta_title: 'Tech Category',
      meta_description: 'Technology reports and case studies',
      keywords: 'tech, angular',
      robots: 'index,follow',
      og: { title: 'Tech OG Title', description: 'Tech OG Desc', image: 'tech-og.png' },
      twitter: { card: 'summary', title: 'Tech Twitter Title', description: 'Tech Twitter Desc', image: 'tech-twitter.png' },
      canonical_url: 'https://example.com/category/tech',
      schema_markup: '{"@context": "https://schema.org", "@type": "WebPage"}'
    },
    data: {
      name: 'Technology',
      other_slug: 'technology-ar',
      articles: {
        data: [
          { id: 1, title: 'Article 1', isFavorite: false },
          { id: 2, title: 'Article 2', isFavorite: true }
        ],
        meta: {
          total: 2,
          current_page: 1,
          last_page: 1
        }
      },
      topics: [
        { id: 101, name: 'Angular' },
        { id: 102, name: 'React' }
      ],
      categories: [
        { id: 201, name: 'Web Dev' }
      ]
    }
  };

  beforeEach(async () => {
    queryParamsSubject = new BehaviorSubject<any>({});

    mockRouter = {
      url: '/category/case-studies',
      navigate: vi.fn().mockImplementation(() => Promise.resolve(true))
    };

    mockLanguageService = {
      currentLang: signal('en'),
      getBrowserOrSavedLang: () => 'en',
      setLanguage: () => { },
      initLang: () => { },
      t: (en: string, ar: string) => (mockLanguageService.currentLang() === 'ar' ? ar : en)
    };

    mockSeoService = {
      updateSeo: vi.fn()
    };

    mockPageResource = {
      value: signal<any>(undefined),
      status: signal<any>('idle'),
      isLoading: signal(false),
      error: signal<any>(undefined),
      reload: vi.fn().mockReturnValue(true)
    };

    mockCategoryService = {
      getCategoryPage: vi.fn().mockReturnValue(mockPageResource)
    };

    mockResponseInit = {
      status: 200
    };

    await TestBed.configureTestingModule({
      imports: [CategoryComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { queryParams: queryParamsSubject.asObservable() } },
        { provide: LanguageService, useValue: mockLanguageService },
        { provide: SeoService, useValue: mockSeoService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: RESPONSE_INIT, useValue: mockResponseInit }
      ]
    })
      .overrideComponent(CategoryComponent, {
        set: {
          imports: [
            RouterLink,
            NgOptimizedImage,
            MockTranslatePipe,
            MockSkeletonComponent,
            MockEmptyStateComponent,
            MockPaginationComponent,
            MockCaseStudiesCardComponent,
            MockMainInnerHeaderComponent,
            MockBookmarkButtonComponent,
            MockMarkataImageDirective
          ]
        }
      })
      .compileComponents();
  });

  function createComponent(slugVal = 'case-studies') {
    const fixture = TestBed.createComponent(CategoryComponent);
    fixture.componentRef.setInput('slug', slugVal);
    component = fixture.componentInstance;
    fixture.detectChanges();
    return fixture;
  }

  it('should create the component with initial defaults', () => {
    createComponent();
    expect(component).toBeTruthy();
    expect(component.searchQuery()).toBe('');
    expect(component.caseStudiesView()).toBe('grid');
    expect(component.filterVal()).toBe('');
    expect(component.currentPage()).toBe(1);
  });

  it('should parse currentPage from queryParams correctly', () => {
    queryParamsSubject.next({ page: '3' });
    createComponent();
    expect(component.currentPage()).toBe(3);
  });

  it('should fallback currentPage to 1 when queryParams has invalid page', () => {
    queryParamsSubject.next({ page: 'abc' });
    createComponent();
    expect(component.currentPage()).toBe(1);

    queryParamsSubject.next({ page: '-5' });
    expect(component.currentPage()).toBe(1);
  });

  it('should determine isCategoryRoute based on router url', () => {
    mockRouter.url = '/category/business';
    createComponent();
    expect(component.isCategoryRoute()).toBe(true);

    mockRouter.url = '/topic/marketing';
    const fixture = createComponent();
    // Force computed evaluation update if needed
    fixture.detectChanges();
    expect(component.isCategoryRoute()).toBe(false);
  });

  it('should correctly set params passed to CategoryService.getCategoryPage', () => {
    mockRouter.url = '/category/tech';
    queryParamsSubject.next({ page: '2' });
    createComponent('tech-slug');

    expect(mockCategoryService.getCategoryPage).toHaveBeenCalled();
    const serviceArgs = mockCategoryService.getCategoryPage.mock.calls[0][0] as CategoryParams;

    expect(serviceArgs.isCategoryRoute()).toBe(true);
    expect(serviceArgs.slug()).toBe('tech-slug');
    expect(serviceArgs.filterVal()).toBe('');
    expect(serviceArgs.currentPage()).toBe(2);
  });

  it('should map pageResource data to computed properties correctly', () => {
    createComponent();

    // Simulate loaded data
    mockPageResource.value.set(mockCategoryResponse);
    mockPageResource.status.set('resolved');
    TestBed.tick();

    expect(component.pageData()).toEqual(mockCategoryResponse.data);
    expect(component.articles()).toEqual(mockCategoryResponse.data.articles.data);
    expect(component.meta()).toEqual(mockCategoryResponse.data.articles.meta);
    expect(component.pageTitle()).toBe('Technology');
  });

  it('should computed filterOptions return topics on Category route and categories on Topic route', () => {
    mockRouter.url = '/category/business';
    createComponent();

    mockPageResource.value.set(mockCategoryResponse);
    mockPageResource.status.set('resolved');
    TestBed.tick();

    expect(component.filterOptions()).toEqual(mockCategoryResponse.data.topics);

    // Switch to Topic route
    mockRouter.url = '/topic/react';
    const fixture = createComponent();
    mockPageResource.value.set(mockCategoryResponse);
    mockPageResource.status.set('resolved');
    fixture.detectChanges();
    TestBed.tick();

    expect(component.filterOptions()).toEqual(mockCategoryResponse.data.categories);
  });

  it('should return correct resultsCountText based on active language', () => {
    createComponent();
    mockPageResource.value.set(mockCategoryResponse);

    // Test English
    mockLanguageService.currentLang.set('en');
    TestBed.tick();
    expect(component.resultsCountText()).toBe('Showing 2 reports');

    // Test Arabic
    mockLanguageService.currentLang.set('ar');
    TestBed.tick();
    expect(component.resultsCountText()).toBe('تم العثور على 2 تقرير');
  });

  it('should handle onFilterChange event', () => {
    createComponent();
    const mockEvent = {
      target: { value: 'my-topic-filter' }
    } as unknown as Event;

    component.onFilterChange(mockEvent);
    expect(component.filterVal()).toBe('my-topic-filter');
  });

  it('should handle setCaseStudiesView layout changes', () => {
    createComponent();
    component.setCaseStudiesView('list');
    expect(component.caseStudiesView()).toBe('list');

    component.setCaseStudiesView('grid');
    expect(component.caseStudiesView()).toBe('grid');
  });

  it('should clear all filters and search query when clearCaseStudiesFilters is called', () => {
    createComponent();
    component.filterVal.set('some-filter');
    component.searchQuery.set('angular query');

    component.clearCaseStudiesFilters();
    expect(component.filterVal()).toBe('');
    expect(component.searchQuery()).toBe('');
  });

  it('should set response status to 404 on SSR when resource fails to load', () => {
    // Initialise with error state
    mockPageResource.status.set('error');
    mockPageResource.isLoading.set(false);
    mockPageResource.error.set({ message: 'Not found' });

    createComponent();
    TestBed.tick();

    expect(mockResponseInit.status).toBe(404);
  });

  it('should set response status to 404 on SSR when response has no data', () => {
    mockPageResource.status.set('resolved');
    mockPageResource.isLoading.set(false);
    mockPageResource.value.set(null); // No data

    createComponent();
    TestBed.tick();

    expect(mockResponseInit.status).toBe(404);
  });

  it('should update SEO metadata when pageResource loads successfully', () => {
    createComponent();
    mockPageResource.status.set('resolved');
    mockPageResource.value.set(mockCategoryResponse);
    TestBed.tick();

    expect(mockSeoService.updateSeo).toHaveBeenCalledWith(mockCategoryResponse.seo);
  });

  defineBilingualRoutingTests({
    createComponent: (slug: string) => {
      const fixture = TestBed.createComponent(CategoryComponent);
      fixture.componentRef.setInput('slug', slug);
      component = fixture.componentInstance;
      fixture.detectChanges();
      return { component, fixture };
    },
    getCurrentLangSignal: () => mockLanguageService.currentLang,
    getResourceValueSignal: () => mockPageResource.value,
    getResourceStatusSignal: () => mockPageResource.status,
    getSeoServiceSpy: () => mockSeoService,
    getRouterSpy: () => mockRouter,
    basePath: 'category',
    mockResponseData: (lang: string, otherSlug: string, title: string) => ({
      seo: {
        meta_title: title,
        meta_description: 'Test Description',
        keywords: 'test',
        robots: 'index,follow'
      },
      data: {
        name: 'Technology',
        other_slug: otherSlug
      }
    })
  });

  it('should reset query param page when filterVal changes and page is not 1', () => {
    queryParamsSubject.next({ page: '3' });
    createComponent();

    expect(component.currentPage()).toBe(3);

    component.filterVal.set('some-new-filter');
    TestBed.tick();

    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      relativeTo: expect.anything(),
      queryParams: { page: undefined },
      queryParamsHandling: 'merge'
    });
  });

  it('should reset query param page when searchQuery changes and page is not 1', () => {
    queryParamsSubject.next({ page: '4' });
    createComponent();

    expect(component.currentPage()).toBe(4);

    component.searchQuery.set('angular');
    TestBed.tick();

    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      relativeTo: expect.anything(),
      queryParams: { page: undefined },
      queryParamsHandling: 'merge'
    });
  });

  it('should debounce search query correctly', async () => {
    createComponent();

    component.searchQuery.set('ang');
    TestBed.tick();
    expect(component.searchQueryDebounced.value()).toBe('');

    // Wait for 350ms to allow real debounce timeout (300ms) to trigger
    await new Promise(resolve => setTimeout(resolve, 350));
    TestBed.tick();

    expect(component.searchQueryDebounced.value()).toBe('ang');
  });
});
