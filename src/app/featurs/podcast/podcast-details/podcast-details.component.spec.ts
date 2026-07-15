import { TestBed } from '@angular/core/testing';
import { PodcastDetailsComponent } from './podcast-details.component';
import { PodcastService } from '../services/podcast.service';
import { LanguageService } from '@core/services/language.service';
import { SeoService } from '@shared/services/seo.service';
import { Router, ActivatedRoute, RouterLink, convertToParamMap } from '@angular/router';
import { RESPONSE_INIT, signal, Component, Directive, input, model, output, Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { NgOptimizedImage, DOCUMENT, DatePipe } from '@angular/common';
import { defineBilingualRoutingTests } from '@shared/testing/bilingual-routing.spec-helper';
import { environment } from '@env/environment';

// Mock components, directives and pipes to isolate PodcastDetailsComponent unit tests
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

describe('PodcastDetailsComponent', () => {
  let component: PodcastDetailsComponent;
  let mockRouter: any;
  let mockLanguageService: any;
  let mockSeoService: any;
  let mockPodcastService: any;
  let mockResponseInit: any;
  let mockPodcastResource: any;
  let mockDocument: any;
  let mockNavigator: any;
  let queryParamMapSubject: BehaviorSubject<any>;

  const mockPodcastResponse = {
    seo: {
      meta_title: 'Tech Podcast',
      meta_description: 'Detail podcast description',
      keywords: 'podcast, angular',
      robots: 'index,follow'
    },
    other_slug: 'tech-podcast-ar',
    data: {
      id: 8,
      title: 'Podcasting in depth',
      short_text: 'Deep dive into podcast production',
      body: 'Podcasts are a great way to communicate.',
      reading_time: 15,
      published_at: '2026-07-15T12:00:00Z',
      is_favorite: false,
      video_url: 'https://youtube.com/embed/test',
      author: {
        name: 'Podcast Host',
        job_title: 'FM Director',
        image: { url: 'host-avatar.png' }
      },
      image: { url: 'hero-podcast.png' },
      episodes: [
        { id: 10, title: 'Episode 1', slug: 'ep-1', video_url: 'https://youtube.com/embed/ep-1' },
        { id: 11, title: 'Episode 2', slug: 'ep-2', video_url: 'https://youtube.com/embed/ep-2' }
      ]
    },
    next_broadcasts: [],
    related_broadcasts: [],
    random_broadcasts: []
  };

  beforeEach(async () => {
    queryParamMapSubject = new BehaviorSubject<any>(convertToParamMap({}));

    mockRouter = {
      url: '/podcasts/tech-podcast',
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

    mockPodcastResource = {
      value: signal<any>(undefined),
      status: signal<any>('idle'),
      isLoading: signal(false),
      error: signal<any>(undefined),
      reload: vi.fn().mockReturnValue(true)
    };

    mockPodcastService = {
      getBroadcastDetails: vi.fn().mockReturnValue(mockPodcastResource)
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
      imports: [PodcastDetailsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { queryParamMap: queryParamMapSubject.asObservable() } },
        { provide: LanguageService, useValue: mockLanguageService },
        { provide: SeoService, useValue: mockSeoService },
        { provide: PodcastService, useValue: mockPodcastService },
        { provide: RESPONSE_INIT, useValue: mockResponseInit }
      ]
    })
    .overrideComponent(PodcastDetailsComponent, {
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
          MockSubscribeFormComponent,
          MockMarkataImageDirective
        ]
      }
    })
    .compileComponents();
  });

  function createComponent(slugVal = 'tech-podcast') {
    const fixture = TestBed.createComponent(PodcastDetailsComponent);
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

  it('should request the correct podcast details from PodcastService', () => {
    createComponent('custom-podcast-slug');
    expect(mockPodcastService.getBroadcastDetails).toHaveBeenCalled();
    const activeSlugSignal = mockPodcastService.getBroadcastDetails.mock.calls[0][0];
    expect(activeSlugSignal()).toBe('custom-podcast-slug');
  });

  it('should map resource response correctly to computed properties', () => {
    createComponent();
    mockPodcastResource.value.set(mockPodcastResponse);
    mockPodcastResource.status.set('resolved');
    TestBed.tick();

    expect(component.podcastData()).toEqual(mockPodcastResponse.data);
    expect(component.podcastBodyHtml()).toContain('Podcasts are a great way to communicate.');
    expect(component.podcastUrl()).toBe(`${environment.siteUrl}/en/podcasts/tech-podcast`);
  });

  it('should determine activeEpisode based on query params', () => {
    // No query param -> default to episode[0]
    createComponent();
    mockPodcastResource.value.set(mockPodcastResponse);
    mockPodcastResource.status.set('resolved');
    TestBed.tick();

    expect(component.activeEpisode()?.slug).toBe('ep-1');

    // Query param set to ep-2
    queryParamMapSubject.next(convertToParamMap({ episode: 'ep-2' }));
    TestBed.tick();
    expect(component.activeEpisode()?.slug).toBe('ep-2');
  });

  it('should play video and set sanitizedVideoUrl', () => {
    createComponent();
    component.playVideo('https://youtube.com/embed/ep-2');
    expect(component.sanitizedVideoUrl()).toBeTruthy();

    component.closeVideo();
    expect(component.sanitizedVideoUrl()).toBeNull();
  });

  it('should handle copyPodcastLink correctly', async () => {
    const { component: comp } = createComponent();
    mockPodcastResource.value.set(mockPodcastResponse);
    mockPodcastResource.status.set('resolved');
    TestBed.tick();

    const mockEvent = {
      preventDefault: vi.fn()
    } as unknown as Event;

    comp.copyPodcastLink(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(`${environment.siteUrl}/en/podcasts/tech-podcast`);
    
    await Promise.resolve();
    expect(comp.copied()).toBe(true);
  });

  // Call the shared bilingual routing test suite
  defineBilingualRoutingTests({
    createComponent: (slug: string) => createComponent(slug),
    getCurrentLangSignal: () => mockLanguageService.currentLang,
    getResourceValueSignal: () => mockPodcastResource.value,
    getResourceStatusSignal: () => mockPodcastResource.status,
    getSeoServiceSpy: () => mockSeoService,
    getRouterSpy: () => mockRouter,
    basePath: 'podcasts',
    mockResponseData: (lang: string, otherSlug: string, title: string) => ({
      seo: {
        meta_title: title,
        meta_description: 'Test Description',
        keywords: 'test',
        robots: 'index,follow'
      },
      other_slug: otherSlug,
      data: {
        id: 8,
        title: title,
        body: 'Podcast show notes'
      }
    })
  });
});
