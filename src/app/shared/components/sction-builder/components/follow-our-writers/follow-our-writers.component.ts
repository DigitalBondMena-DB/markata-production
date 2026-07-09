import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgOptimizedImage } from '@angular/common';
import { MarkataImageDirective } from '../../../../directives/markata-image.directive';
import { Author } from '../../../../../core/interfaces/home.interface';
import { LanguageService } from '../../../../../core/services/language.service';

@Component({
  selector: 'app-follow-our-writers',
  imports: [RouterLink, TranslatePipe, NgOptimizedImage, MarkataImageDirective],
  templateUrl: './follow-our-writers.component.html',
  styleUrl: './follow-our-writers.component.css',
})
export class FollowOurWritersComponent {
  readonly lang = inject(LanguageService);
  readonly authors = input.required<Author[]>();
}

