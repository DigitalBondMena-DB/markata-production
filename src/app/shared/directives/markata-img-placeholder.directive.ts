import { AfterViewInit, Directive, ElementRef, inject, input, Renderer2, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment';

@Directive({
  selector: '[markataImg]'
})
export class MarkataImgPlaceholderDirective implements AfterViewInit {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);

  readonly seed = input('');

  readonly eager = input(false);
  readonly highPriority = input(false);
  readonly alt = input('');
  ngAfterViewInit(): void {
    const el = this.host.nativeElement;
    let img = el.querySelector('img') as HTMLImageElement;

    const fallback =
      'data:image/svg+xml,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600"><rect fill="#EDEAE4" width="900" height="600"/></svg>'
      );

    if (!img) {
      const imageUrl = `${environment.imageBaseUrl}${this.seed()}`;
      img = this.renderer.createElement('img') as HTMLImageElement;
      this.renderer.setAttribute(img, 'alt', this.alt());
      this.renderer.setAttribute(img, 'width', '900');
      this.renderer.setAttribute(img, 'height', '600');
      this.renderer.setAttribute(img, 'decoding', 'async');
      this.renderer.setAttribute(img, 'loading', this.eager() ? 'eager' : 'lazy');

      const isHighPriority = this.highPriority();
      if (isHighPriority) {
        this.renderer.setAttribute(img, 'fetchpriority', 'high');

        // Inject dynamic link rel="preload" into document head for immediate LCP discovery
        const exists = this.document.head.querySelector(`link[rel="preload"][href="${imageUrl}"]`);
        if (!exists) {
          const link = this.renderer.createElement('link');
          this.renderer.setAttribute(link, 'rel', 'preload');
          this.renderer.setAttribute(link, 'as', 'image');
          this.renderer.setAttribute(link, 'fetchpriority', 'high');
          this.renderer.setAttribute(link, 'href', imageUrl);

          // Insert at the very top of the head for maximum preload efficiency
          const firstChild = this.document.head.firstChild;
          if (firstChild) {
            this.renderer.insertBefore(this.document.head, link, firstChild);
          } else {
            this.renderer.appendChild(this.document.head, link);
          }
        }
      }
      this.renderer.setStyle(img, 'width', '100%');
      this.renderer.setStyle(img, 'height', '100%');
      this.renderer.setStyle(img, 'object-fit', 'cover');
      this.renderer.setStyle(img, 'display', 'block');

      // Set src
      this.renderer.setAttribute(img, 'src', imageUrl);
      this.renderer.appendChild(el, img);
    }

    // Attach listener and check if already failed (for both SSR image and newly created image)
    if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
      this.renderer.setAttribute(img, 'src', fallback);
    } else {
      let unlistenError: (() => void) | null = this.renderer.listen(img, 'error', () => {
        this.renderer.setAttribute(img, 'src', fallback);
        if (unlistenError) {
          unlistenError();
          unlistenError = null;
        }
      });

      this.destroyRef.onDestroy(() => {
        if (unlistenError) {
          unlistenError();
        }
      });
    }
  }
}
