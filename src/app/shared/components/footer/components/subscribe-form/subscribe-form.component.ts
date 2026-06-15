import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-subscribe-form',
  imports: [TranslatePipe],
  templateUrl: './subscribe-form.component.html',
  styleUrl: './subscribe-form.component.css',
})
export class SubscribeFormComponent {}
