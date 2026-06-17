import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  imports: [],
  template: `<ng-content></ng-content>`,
  styleUrl: './skeleton.component.css'
})
export class SkeletonComponent {}
