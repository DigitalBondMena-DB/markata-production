import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgOptimizedImage } from '@angular/common';
import { LanguageService } from '@core/services/language.service';
import { MarkataImageDirective } from '@shared/directives/markata-image.directive';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { HomeService } from '@features/home/services/home.service';
import { MainInnerHeaderComponent } from "@shared/components/main-inner-header/main-inner-header.component";

@Component({
  selector: 'app-writers',
  imports: [
    RouterLink,
    TranslatePipe,
    NgOptimizedImage,
    MarkataImageDirective,
    SkeletonComponent,
    MainInnerHeaderComponent
  ],
  templateUrl: './writers.component.html',
  styleUrl: './writers.component.css'
})
export class WritersComponent {
  readonly lang = inject(LanguageService);
  private readonly homeService = inject(HomeService);

  readonly writers = computed(() => this.homeService.homeResource.value()?.data?.authors ?? []);
  readonly isLoading = computed(() => this.homeService.homeResource.isLoading());
}
