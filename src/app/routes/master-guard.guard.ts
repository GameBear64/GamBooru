import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { MasterAuthService } from './master-auth.service';

@Injectable({
  providedIn: 'root',
})
export class MasterGuardGuard implements CanActivate {
  constructor(private authService: MasterAuthService) {}

  canActivate() {
    if (this.authService.loggedIn?.user) {
      return true;
    } else {
      return false;
    }
  }
}
