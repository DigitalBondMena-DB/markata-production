import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MainInnerHeaderComponent } from '@shared/components/main-inner-header/main-inner-header.component';
import { PlatformHeadquartersComponent } from '../../components/platform-headquarters/platform-headquarters.component';
import { WriteWithUsComponent } from '../../components/write-with-us/write-with-us.component';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';

@Component({
  selector: 'app-contact-us',
  imports: [
    RouterOutlet,
    TranslatePipe,
    MainInnerHeaderComponent,
    PlatformHeadquartersComponent,
    WriteWithUsComponent,
    ContactFormComponent
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
}
