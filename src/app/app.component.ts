import { Component } from '@angular/core';
import { MasterAuthService } from './routes/master-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(protected auth: MasterAuthService) {}

  title = 'GamBooru';
}
