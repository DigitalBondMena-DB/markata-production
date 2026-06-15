import { AfterViewInit, Directive, ElementRef, inject, input, Renderer2, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/** Injects a picsum <img> into `.img-placeholder` */
@Directive({
  selector: '[markataImg]'
})
export class MarkataImgPlaceholderDirective implements AfterViewInit {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);

  /** Optional; also reads `data-img-seed` on the host when empty. */
  readonly seed = input('');

  readonly eager = input(false);
  readonly highPriority = input(false);
  readonly hiPriority = input(false);

  ngAfterViewInit(): void {
    const el = this.host.nativeElement;
    if (el.querySelector('img')) {
      return;
    }

    const fromAttr = el.getAttribute('data-img-seed');
    const raw = (fromAttr || this.seed() || 'markata').replace(/[^a-z0-9\-]/gi, '').slice(0, 64);
    const key = raw || 'markata';
    const imageUrl = `https://picsum.photos/seed/${key}/900/600`;

    const img = this.renderer.createElement('img') as HTMLImageElement;
    this.renderer.setAttribute(img, 'alt', '');
    this.renderer.setAttribute(img, 'width', '900');
    this.renderer.setAttribute(img, 'height', '600');
    this.renderer.setAttribute(img, 'decoding', 'async');
    this.renderer.setAttribute(img, 'loading', this.eager() ? 'eager' : 'lazy');

    const isHighPriority = this.highPriority() || this.hiPriority();
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

    const fallback =
      'data:image/svg+xml,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600"><rect fill="#EDEAE4" width="900" height="600"/></svg>'
      );

    // 1. Attach the listener BEFORE setting img.src to catch errors immediately
    let unlistenError: (() => void) | null = this.renderer.listen(img, 'error', () => {
      this.renderer.setAttribute(img, 'src', fallback);
      if (unlistenError) {
        unlistenError();
        unlistenError = null;
      }
    });

    // 2. Clean up listener on destruction if error never fired
    this.destroyRef.onDestroy(() => {
      if (unlistenError) {
        unlistenError();
      }
    });

    // 3. Set src after listener registration
    this.renderer.setAttribute(img, 'src', imageUrl);

    this.renderer.appendChild(el, img);
  }
}
