import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { MasterAuthService } from '../master-auth.service';

@Injectable({
  providedIn: 'root',
})
export class GalleryGuardGuard implements CanActivate {
  constructor(private authService: MasterAuthService) {}

  canActivate() {
    if (this.authService.loggedIn) {
      return true;
    } else {
      return false;
    }
  }
}
