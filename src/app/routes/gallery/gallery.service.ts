import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MasterAuthService } from '../master-auth.service';

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

  getPosts() {
    return this.http.get('http://localhost:3030/post/page/1');
  }

  getPost(postId: string) {
    return this.http.get('http://localhost:3030/post/' + postId);
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
}
