import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MarkataImgPlaceholderDirective } from '../../../../directives/markata-img-placeholder.directive';

@Component({
  selector: 'app-list-section',
  imports: [RouterLink, TranslatePipe, MarkataImgPlaceholderDirective],
  templateUrl: './list-section.component.html',
  styleUrl: './list-section.component.css',
})
export class ListSectionComponent {}
