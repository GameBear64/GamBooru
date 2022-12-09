import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MasterAuthService } from 'src/app/routes/master-auth.service';

@Injectable({
  providedIn: 'root',
})
export class CommentBoxService {
  constructor(private http: HttpClient, private mAuth: MasterAuthService) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      jwt: this.mAuth.loggedIn?.jwt || 'none',
    }),
  };

  edit(commentId: string, content: string) {
    this.http
      .patch<any>(
        `${this.mAuth.APIUrl}/comment/` + commentId,
        { content },
        this.httpOptions
      )
      .subscribe();
  }

  delete(commentId: string) {
    this.http
      .delete<any>(
        `${this.mAuth.APIUrl}/comment/` + commentId,
        this.httpOptions
      )
      .subscribe();
  }

  like(commentId: string) {
    this.http
      .post<any>(
        `${this.mAuth.APIUrl}/comment/like/` + commentId,
        {},
        this.httpOptions
      )
      .subscribe();
  }

  flag(commentId: string, reason: string) {
    this.http
      .post<any>(
        `${this.mAuth.APIUrl}/comment/flag/` + commentId,
        { reason },
        this.httpOptions
      )
      .subscribe();
  }

  voteDelete(commentId: string) {
    return this.http
      .post<any>(
        `${this.mAuth.APIUrl}/comment/voteDelete/${commentId}`,
        {},
        this.httpOptions
      )
      .subscribe();
  }
}
