import { AfterViewInit, Directive, ElementRef, inject, input, Renderer2, DestroyRef } from '@angular/core';

/** Injects a picsum <img> into `.img-placeholder` */
@Directive({
  selector: '[markataImg]'
})
export class MarkataImgPlaceholderDirective implements AfterViewInit {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);

  /** Optional; also reads `data-img-seed` on the host when empty. */
  readonly seed = input('');

  readonly eager = input(false);
  readonly highPriority = input(false);

  ngAfterViewInit(): void {
    const el = this.host.nativeElement;
    if (el.querySelector('img')) {
      return;
    }

    const fromAttr = el.getAttribute('data-img-seed');
    const raw = (fromAttr || this.seed() || 'markata').replace(/[^a-z0-9\-]/gi, '').slice(0, 64);
    const key = raw || 'markata';

    const img = this.renderer.createElement('img') as HTMLImageElement;
    this.renderer.setAttribute(img, 'alt', '');
    this.renderer.setAttribute(img, 'width', '900');
    this.renderer.setAttribute(img, 'height', '600');
    this.renderer.setAttribute(img, 'decoding', 'async');
    this.renderer.setAttribute(img, 'loading', this.eager() ? 'eager' : 'lazy');
    if (this.highPriority()) {
      this.renderer.setAttribute(img, 'fetchpriority', 'high');
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
    this.renderer.setAttribute(img, 'src', `https://picsum.photos/seed/${key}/900/600`);

    this.renderer.appendChild(el, img);
  }
}
