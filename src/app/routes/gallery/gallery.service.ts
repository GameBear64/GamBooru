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

  getPosts(page: number, searchParams: any) {
    let search = new URLSearchParams(searchParams).toString();
    return this.http.get(`${this.mAuth.APIUrl}/post/page/${page}?${search}`);
  }

  getPost(postId: string) {
    return this.http.get(
      `${this.mAuth.APIUrl}/post/${postId}`,
      this.httpOptions
    );
  }

  patchPost(postId: string, updatedContent: any) {
    return this.http
      .patch(
        `${this.mAuth.APIUrl}/post/${postId}`,
        updatedContent,
        this.httpOptions
      )
      .subscribe();
  }

  post(content: any) {
    // names ${cc.generate({ parts: 1, partLen: 5 }).toLocaleLowerCase()}_${artist + (artist || metadata)}
    this.http
      .post<any>(`${this.mAuth.APIUrl}/post`, content, this.httpOptions)
      .subscribe();
  }

  postComment(postId: string, comment: string) {
    this.http
      .post<any>(
        `${this.mAuth.APIUrl}/comment/${postId}`,
        comment,
        this.httpOptions
      )
      .subscribe();
  }

  postDelete(postId: string) {
    this.http
      .delete<any>(`${this.mAuth.APIUrl}/post/${postId}`, this.httpOptions)
      .subscribe();
  }

  postLike(postId: string) {
    this.http
      .post<any>(
        `${this.mAuth.APIUrl}/post/like/${postId}`,
        {},
        this.httpOptions
      )
      .subscribe();
  }

  postFlag(postId: string, reason: string) {
    this.http
      .post<any>(
        `${this.mAuth.APIUrl}/post/flag/${postId}`,
        { reason },
        this.httpOptions
      )
      .subscribe();
  }

  getCollectionList(userId: string) {
    return this.http.get(
      `${this.mAuth.APIUrl}/collection/list/${userId}`,
      this.httpOptions
    );
  }

  addToCollection(postId: string, collections: string[]) {
    return this.http
      .post<any>(
        `${this.mAuth.APIUrl}/collection/add`,
        { post: postId, collections },
        this.httpOptions
      )
      .subscribe();
  }

  getCount() {
    return this.http.get<{ count: number; pages: number }>(
      `${this.mAuth.APIUrl}/post/count`
    );
  }

  voteDeletePost(postId: string) {
    return this.http
      .post<any>(
        `${this.mAuth.APIUrl}/post/voteDelete/${postId}`,
        {},
        this.httpOptions
      )
      .subscribe();
  }
}
