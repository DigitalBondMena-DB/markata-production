import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MainInnerHeaderComponent } from "@shared/components/main-inner-header/main-inner-header.component";

@Component({
  selector: 'app-privacy-policy',
  imports: [TranslatePipe, MainInnerHeaderComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css',
})
export class PrivacyPolicyComponent { }
