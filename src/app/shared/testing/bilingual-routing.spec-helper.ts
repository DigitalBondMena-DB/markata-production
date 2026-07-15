import { TestBed } from '@angular/core/testing';
import { expect, it } from 'vitest';

export interface BilingualRoutingTestOptions {
  createComponent: (slug: string) => { component: any; fixture: any };
  getCurrentLangSignal: () => { set: (val: string) => void; (): string };
  getResourceValueSignal: () => { set: (val: any) => void };
  getResourceStatusSignal: () => { set: (val: any) => void };
  getSeoServiceSpy: () => { updateSeo: any };
  getRouterSpy: () => { navigate: any };
  basePath: string; // e.g., 'category', 'article', 'podcasts'
  mockResponseData: (lang: string, otherSlug: string, title: string) => any;
}

export function defineBilingualRoutingTests(options: BilingualRoutingTestOptions) {
  it('should sync SEO and redirect correctly when switching languages without routing loops', () => {
    // Resolve dynamic getters at runtime when test executes
    const currentLangSignal = options.getCurrentLangSignal();
    const resourceValueSignal = options.getResourceValueSignal();
    const resourceStatusSignal = options.getResourceStatusSignal();
    const seoServiceSpy = options.getSeoServiceSpy();
    const routerSpy = options.getRouterSpy();

    // ---------------------------------------------------------
    // Phase 1: Load in Arabic, shift to English
    // ---------------------------------------------------------
    currentLangSignal.set('ar');
    resourceStatusSignal.set('resolved');

    // Resolve the Arabic resource value
    const arResponse = options.mockResponseData('ar', 'slug-en', 'SEO Title AR');
    resourceValueSignal.set(arResponse);

    // Create the Arabic component instance
    const { component: compAr, fixture: fixtureAr } = options.createComponent('slug-ar');
    TestBed.tick();

    // Verify SEO was updated and bilingual state loaded correctly
    expect(seoServiceSpy.updateSeo).toHaveBeenCalledWith(arResponse.seo);
    expect(compAr.loadedLang()).toBe('ar');
    expect(compAr.otherSlug()).toBe('slug-en');
    expect(routerSpy.navigate).not.toHaveBeenCalled();

    // Switch language to English -> expect redirection to English slug
    currentLangSignal.set('en');
    TestBed.tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/', 'en', options.basePath, 'slug-en'],
      { replaceUrl: true }
    );
    expect(compAr.loadedLang()).toBeNull();
    expect(compAr.otherSlug()).toBeNull();

    // Clear spy calls for Phase 2
    routerSpy.navigate.mockClear();
    seoServiceSpy.updateSeo.mockClear();

    // ---------------------------------------------------------
    // Phase 2: Simulating Router Navigation completion to English.
    // Router destroys previous component and instantiates a new one.
    // ---------------------------------------------------------
    currentLangSignal.set('en');
    resourceStatusSignal.set('resolved');

    // Resolve the English resource value
    const enResponse = options.mockResponseData('en', 'slug-ar', 'SEO Title EN');
    resourceValueSignal.set(enResponse);

    // Create the English component instance
    const { component: compEn, fixture: fixtureEn } = options.createComponent('slug-en');
    TestBed.tick();

    // Verify SEO was updated and bilingual state loaded correctly
    expect(seoServiceSpy.updateSeo).toHaveBeenCalledWith(enResponse.seo);
    expect(compEn.loadedLang()).toBe('en');
    expect(compEn.otherSlug()).toBe('slug-ar');
    expect(routerSpy.navigate).not.toHaveBeenCalled();

    // Switch language back to Arabic -> expect redirection to Arabic slug
    currentLangSignal.set('ar');
    TestBed.tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/', 'ar', options.basePath, 'slug-ar'],
      { replaceUrl: true }
    );
    expect(compEn.loadedLang()).toBeNull();
    expect(compEn.otherSlug()).toBeNull();
  });
}
