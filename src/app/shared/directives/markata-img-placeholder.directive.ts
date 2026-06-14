import { AfterViewInit, Directive, ElementRef, inject, input, Renderer2 } from '@angular/core';

/** Injects a picsum <img> into `.img-placeholder` */
@Directive({
  selector: '[markataImg]',
  standalone: true
})
export class MarkataImgPlaceholderDirective implements AfterViewInit {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  /** Optional; also reads `data-img-seed` on the host when empty. */
  readonly seed = input('');

  readonly eager = input(false);
  readonly highPriority = input(false);

  ngAfterViewInit(): void {
    const el = this.host.nativeElement;
    const fromAttr = el.getAttribute('data-img-seed');
    const raw = (fromAttr || this.seed() || 'markata').replace(/[^a-z0-9\-]/gi, '').slice(0, 64);
    const key = raw || 'markata';

    const img = this.renderer.createElement('img') as HTMLImageElement;
    img.alt = '';
    img.width = 900;
    img.height = 600;
    img.decoding = 'async';
    img.loading = this.eager() ? 'eager' : 'lazy';
    if (this.highPriority() && 'fetchPriority' in img) {
      img.fetchPriority = 'high';
    }
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    img.src = `https://picsum.photos/seed/${key}/900/600`;

    const fallback =
      'data:image/svg+xml,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600"><rect fill="#EDEAE4" width="900" height="600"/></svg>'
      );
    img.addEventListener('error', () => {
      img.src = fallback;
    });

    this.renderer.appendChild(el, img);
  }
}
