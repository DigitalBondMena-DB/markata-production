import { Component } from '@angular/core';
import { HeroSecitonComponent } from './components/hero-seciton/hero-seciton.component';

@Component({
  selector: 'app-home',
  imports: [HeroSecitonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
