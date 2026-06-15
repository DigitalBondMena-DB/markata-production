import { Component } from '@angular/core';
import { CardSectionComponent } from "./components/card-section/card-section.component";
import { FollowOurWritersComponent } from './components/follow-our-writers/follow-our-writers.component';
import { ListSectionComponent } from "./components/list-section/list-section.component";

@Component({
  selector: 'app-sction-builder',
  imports: [CardSectionComponent, FollowOurWritersComponent, ListSectionComponent],
  templateUrl: './sction-builder.component.html',
  styleUrl: './sction-builder.component.css',
})
export class SctionBuilderComponent { }
