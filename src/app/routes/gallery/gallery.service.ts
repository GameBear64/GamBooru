import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MasterAuthService } from '../master-auth.service';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  constructor(private http: HttpClient, private mAuth: MasterAuthService) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      jwt: this.mAuth.loggedIn?.jwt || 'none',
    }),
  };

  getPosts(page: number, searchParams: any) {
    let search = new URLSearchParams(searchParams).toString();
    return this.http.get(`http://localhost:3030/post/page/${page}?${search}`);
  }

  getPost(postId: string) {
    return this.http.get(
      'http://localhost:3030/post/' + postId,
      this.httpOptions
    );
  }

  patchPost(postId: string, updatedContent: any) {
    return this.http
      .patch(
        'http://localhost:3030/post/' + postId,
        updatedContent,
        this.httpOptions
      )
      .subscribe({
        next: (data) => {
          console.log(data);
        },
      });
  }

  post(content: any) {
    // names ${cc.generate({ parts: 1, partLen: 5 }).toLocaleLowerCase()}_${artist + (artist || metadata)}
    this.http
      .post<any>('http://localhost:3030/post', content, this.httpOptions)
      .subscribe({
        next: (data) => {
          console.log(data);
        },
      });
  }

  postComment(postId: string, comment: string) {
    this.http
      .post<any>(
        'http://localhost:3030/comment/' + postId,
        comment,
        this.httpOptions
      )
      .subscribe({
        next: (data) => {
          console.log(data);
        },
      });
  }

  postDelete(postId: string) {
    this.http
      .delete<any>('http://localhost:3030/post/' + postId, this.httpOptions)
      .subscribe();
  }

  postLike(postId: string) {
    this.http
      .post<any>(
        'http://localhost:3030/post/like/' + postId,
        {},
        this.httpOptions
      )
      .subscribe();
  }

  postFlag(postId: string, reason: string) {
    this.http
      .post<any>(
        'http://localhost:3030/post/flag/' + postId,
        { reason },
        this.httpOptions
      )
      .subscribe({
        next: (data) => {
          console.log(data);
        },
      });
  }
}
