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
    return this.http.get(`${this.mAuth.APIUrl}/user/${id}`);
  }

  updateUser(content: any) {
    this.http
      .patch<any>(`${this.mAuth.APIUrl}/user`, content, this.httpOptions)
      .subscribe();
  }

  deleteUser() {
    this.http
      .delete<any>(`${this.mAuth.APIUrl}/user`, this.httpOptions)
      .subscribe();
  }

  resetPassword(content: any) {
    this.http
      .patch<any>(
        `${this.mAuth.APIUrl}/auth/resetPassword`,
        content,
        this.httpOptions
      )
      .subscribe();
  }
}
