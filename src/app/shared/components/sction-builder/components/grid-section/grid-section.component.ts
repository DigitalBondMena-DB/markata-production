import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MarkataImgPlaceholderDirective } from '../../../../directives/markata-img-placeholder.directive';

@Component({
  selector: 'app-grid-section',
  imports: [RouterLink, TranslatePipe, MarkataImgPlaceholderDirective],
  templateUrl: './grid-section.component.html',
  styleUrl: './grid-section.component.css',
})
export class GridSectionComponent {}
