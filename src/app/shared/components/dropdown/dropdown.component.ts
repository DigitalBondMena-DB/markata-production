import { Component, ElementRef, inject, input, signal } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'close()',
  },
})
export class DropdownComponent {
  private readonly elementRef = inject(ElementRef);

  readonly label = input<string>('More');
  readonly isOpen = signal(false);

  toggle(event: MouseEvent) {
    event.stopPropagation();
    this.isOpen.update((prev) => !prev);
  }

  close() {
    this.isOpen.set(false);
  }

  onDocumentClick(event: MouseEvent) {
    if (!this.isOpen()) return;
    
    const target = event.target as HTMLElement;
    const clickedInside = this.elementRef.nativeElement.contains(target);
    
    // Check if the click was inside a dropdown-menu link so it closes automatically after clicking a link
    const clickedLink = target.closest('a') || target.tagName === 'A';
    
    if (!clickedInside || clickedLink) {
      this.close();
    }
  }
}
