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
        'http://localhost:3030/comment/' + commentId,
        { content },
        this.httpOptions
      )
      .subscribe();
  }

  delete(commentId: string) {
    this.http
      .delete<any>(
        'http://localhost:3030/comment/' + commentId,
        this.httpOptions
      )
      .subscribe();
  }

  like(commentId: string) {
    this.http
      .post<any>(
        'http://localhost:3030/comment/like/' + commentId,
        {},
        this.httpOptions
      )
      .subscribe();
  }

  flag(commentId: string, reason: string) {
    this.http
      .post<any>(
        'http://localhost:3030/comment/flag/' + commentId,
        { reason },
        this.httpOptions
      )
      .subscribe();
  }
}
