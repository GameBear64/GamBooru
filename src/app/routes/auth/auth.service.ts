import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MasterAuthService } from '../master-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private mAuth: MasterAuthService) {}

  register(content: any) {
    this.http
      .post<any>(`${this.mAuth.APIUrl}/auth/register`, content)
      .subscribe({
        next: (data) => {
          this.mAuth.loggedIn = data;
          localStorage.setItem('GamBooru', JSON.stringify(data));
        },
      });
  }

  login(content: any) {
    this.http.post<any>(`${this.mAuth.APIUrl}/auth/login`, content).subscribe({
      next: (data) => {
        this.mAuth.loggedIn = data;
        localStorage.setItem('GamBooru', JSON.stringify(data));
      },
    });
  }

  logout() {
    localStorage.clear();
    this.mAuth.logout();
  }
}
