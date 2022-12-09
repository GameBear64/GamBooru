import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MasterAuthService {
  constructor() {}

  APIUrl = `${window.location.protocol}//${window.location.hostname}:3030`;

  loggedIn: { jwt: string; user: { _id: string } } | null = null;

  refreshAuth() {
    this.loggedIn = JSON.parse(localStorage.getItem('GamBooru') || '{}');
  }

  logout() {
    this.loggedIn = null;
  }
}
