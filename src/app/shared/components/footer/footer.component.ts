import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SubscribeFormComponent } from './components/subscribe-form/subscribe-form.component';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe, SubscribeFormComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {}
