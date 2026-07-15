import { Directive, ElementRef, inject, input, effect } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Directive({
  selector: 'img[markataImage]',
  host: {
    '[class.markata-img-loading]': 'isLoading && placeholder()',
    '[class.markata-img-error]': 'hasError',
    '(load)': 'onLoad()',
    '(error)': 'onError()'
  }
})
export class MarkataImageDirective {
  private readonly el = inject(ElementRef<HTMLImageElement>);
  private readonly ngOptimizedImage = inject(NgOptimizedImage, { optional: true });

  // Inputs
  readonly markataImage = input<any>();
  readonly fallback = input<string>('assets/icons/digital-bond.webp');
  readonly placeholder = input<boolean>(true);

  // Performance: Simple primitive properties instead of Signals/Effects
  isLoading = true;
  hasError = false;
  private fallbackApplied = false;

  constructor() {
    // Automatically enable responsive srcset defaults on NgOptimizedImage
    if (this.ngOptimizedImage && !this.ngOptimizedImage.ngSrcset) {
      const widthAttr = this.el.nativeElement.getAttribute('width');
      const isSmallFixed = widthAttr && parseInt(widthAttr, 10) <= 64;

      if (!isSmallFixed) {
        this.ngOptimizedImage.ngSrcset = '300w, 800w, 1200w';
      }
    }

    effect(() => {
      const imgObj = this.markataImage();
      if (this.ngOptimizedImage && imgObj && typeof imgObj === 'object') {
        const url = imgObj.url;
        if (url && !url.includes('?')) {
          const params = new URLSearchParams();
          if (imgObj.medium) params.set('medium', imgObj.medium);
          if (imgObj.thumbnail) params.set('thumbnail', imgObj.thumbnail);
          const query = params.toString();
          if (query) {
            this.ngOptimizedImage.ngSrc = `${url}?${query}`;
          }
        }
      }
    });
  }

  onLoad(): void {
    this.isLoading = false;
  }

  onError(): void {
    this.isLoading = false;
    this.hasError = true;

    if (!this.fallbackApplied) {
      this.fallbackApplied = true;
      const fallbackSrc = this.fallback();
      if (fallbackSrc) {
        this.el.nativeElement.removeAttribute('srcset');
        this.el.nativeElement.src = fallbackSrc;
        this.el.nativeElement.style = 'object-fit: contain';
      }
    }
  }
}
