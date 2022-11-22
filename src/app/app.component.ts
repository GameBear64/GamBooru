import { Component, OnInit } from '@angular/core';
import { MasterAuthService } from './routes/master-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(protected auth: MasterAuthService) {}

  ngOnInit(): void {
    this.auth.refreshAuth();
  }

  title = 'GamBooru';
}
