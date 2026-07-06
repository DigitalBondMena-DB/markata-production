import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { User } from '@core/interfaces/auth.interface';
import { UserNameCharPipe } from '@shared/pipes/user-name-char-pipe.pipe';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [TranslatePipe, UserNameCharPipe],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css'
})
export class ProfileHeaderComponent {
  readonly user = input<User | null>(null);
  readonly savedCount = input<number>(0);
}
