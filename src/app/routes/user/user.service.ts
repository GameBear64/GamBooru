import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MasterAuthService } from '../master-auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private mAuth: MasterAuthService) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      jwt: this.mAuth.loggedIn?.jwt || 'none',
    }),
  };

  getUser(id: string) {
    return this.http.get('http://localhost:3030/user/' + id);
  }

  updateUser(content: any) {
    this.http
      .patch<any>('http://localhost:3030/user', content, this.httpOptions)
      .subscribe({
        next: (data) => {
          console.log(data);
        },
      });
  }

  deleteUser() {
    this.http
      .delete<any>('http://localhost:3030/user', this.httpOptions)
      .subscribe({
        next: (data) => {
          console.log(data);
        },
      });
  }

  resetPassword(content: any) {
    this.http
      .patch<any>(
        'http://localhost:3030/auth/resetPassword',
        content,
        this.httpOptions
      )
      .subscribe({
        next: (data) => {
          console.log(data);
        },
      });
  }
}
