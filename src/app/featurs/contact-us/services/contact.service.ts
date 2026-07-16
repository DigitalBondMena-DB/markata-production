import { Service, signal } from '@angular/core';

@Service()
export class ContactService {
  readonly formSubmitted = signal(false);
}
