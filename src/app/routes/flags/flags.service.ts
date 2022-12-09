import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MasterAuthService } from '../master-auth.service';

@Injectable({
  providedIn: 'root',
})
export class FlagsService {
  constructor(private http: HttpClient, private mAuth: MasterAuthService) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      jwt: this.mAuth.loggedIn?.jwt || 'none',
    }),
  };

  getAllFlags() {
    return this.http.get(`${this.mAuth.APIUrl}/flag`);
  }

  getFlags(parentId: string) {
    return this.http.get(`${this.mAuth.APIUrl}/flag/${parentId}`);
  }

  getFlagFor(id: string) {
    return this.http.get(`${this.mAuth.APIUrl}/flag/of/${id}`);
  }

  getParentOfComment(commentId: string) {
    return this.http.get(`${this.mAuth.APIUrl}/comment/parent/${commentId}`);
  }

  resolveFlag(id: string) {
    this.http
      .post<any>(
        `${this.mAuth.APIUrl}/flag/resolve/${id}`,
        {},
        this.httpOptions
      )
      .subscribe();
  }
}
