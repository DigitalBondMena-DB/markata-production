import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MarkataImgPlaceholderDirective } from '../../../../directives/markata-img-placeholder.directive';

@Component({
  selector: 'app-follow-our-writers',
  imports: [RouterLink, TranslatePipe, MarkataImgPlaceholderDirective],
  templateUrl: './follow-our-writers.component.html',
  styleUrl: './follow-our-writers.component.css',
})
export class FollowOurWritersComponent {}
