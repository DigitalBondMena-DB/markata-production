import { Component, inject } from '@angular/core';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ServerErrorService } from '@core/services/server-error.service';
import { ServerErrorPopupComponent } from '@shared/components/server-error-popup/server-error-popup.component';

@Component({
  selector: 'app-root',
  imports: [MainLayoutComponent, ServerErrorPopupComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly serverErrorService = inject(ServerErrorService);
}
