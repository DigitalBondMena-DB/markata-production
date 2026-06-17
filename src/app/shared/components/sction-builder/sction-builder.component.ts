import { Component, computed, input } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { CardSectionComponent } from "./components/card-section/card-section.component";
import { FollowOurWritersComponent } from './components/follow-our-writers/follow-our-writers.component';
import { ListSectionComponent } from "./components/list-section/list-section.component";
import { GridSectionComponent } from './components/grid-section/grid-section.component';
import { Author, CategoryWithArticles } from '../../../core/interfaces/home.interface';

@Component({
  selector: 'app-sction-builder',
  imports: [
    FollowOurWritersComponent,
    NgComponentOutlet
  ],
  templateUrl: './sction-builder.component.html',
  styleUrl: './sction-builder.component.css',
})
export class SctionBuilderComponent {
  readonly byDisplayType = input.required<{
    grid?: CategoryWithArticles[];
    cards?: CategoryWithArticles[];
    list?: CategoryWithArticles[];
  }>();

  readonly authors = input.required<Author[]>();

  readonly sections = computed(() => {
    const raw = this.byDisplayType();
    const list: any[] = [];
    if (raw?.grid) {
      list.push(...raw.grid.map(s => ({ ...s, type: 'grid' })));
    }
    if (raw?.cards) {
      list.push(...raw.cards.map(s => ({ ...s, type: 'cards' })));
    }
    if (raw?.list) {
      list.push(...raw.list.map(s => ({ ...s, type: 'list' })));
    }

    if (list.length > 0) {
      const mid = Math.floor(list.length / 2);
      list.splice(mid, 0, { type: 'writers', id: 'writers-sec' });
    }
    return list;
  });

  getComponent(type: 'grid' | 'cards' | 'list') {
    switch (type) {
      case 'grid': return GridSectionComponent;
      case 'cards': return CardSectionComponent;
      case 'list': return ListSectionComponent;
      default: throw new Error(`Unknown display type: ${type}`);
    }
  }
}

