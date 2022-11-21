import { Component } from '@angular/core';
import { AuthService } from './routes/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(protected auth: AuthService) {}

  title = 'GamBooru';
}
