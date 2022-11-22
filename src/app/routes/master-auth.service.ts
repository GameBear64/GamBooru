import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MasterAuthService {
  constructor() {}

  loggedIn: { jwt: string; user: { _id: string } } | null = null;

  refreshAuth() {
    this.loggedIn = JSON.parse(localStorage.getItem('GamBooru') || '{}');
  }

  logout() {
    this.loggedIn = null;
  }
}
