import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MarkataImgPlaceholderDirective } from '../../../../directives/markata-img-placeholder.directive';

@Component({
  selector: 'app-card-section',
  imports: [RouterLink, MarkataImgPlaceholderDirective, TranslatePipe],
  templateUrl: './card-section.component.html',
  styleUrl: './card-section.component.css',
})
export class CardSectionComponent { }
