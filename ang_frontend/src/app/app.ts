import { Component, signal } from '@angular/core';
import { RegistrationComponent } from './components/registration/registration.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RegistrationComponent],
  template: `<app-registration></app-registration>`,
  styleUrls: ['./app.css'],
})
export class App {
  protected readonly title = signal('ang_frontend');
}
