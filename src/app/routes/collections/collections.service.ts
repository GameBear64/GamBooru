import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MasterAuthService } from '../master-auth.service';

@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  constructor(private http: HttpClient, private mAuth: MasterAuthService) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      jwt: this.mAuth.loggedIn?.jwt || 'none',
    }),
  };

  getCollection(colId: string) {
    return this.http.get(
      `${this.mAuth.APIUrl}/collection/${colId}`,
      this.httpOptions
    );
  }

  getLikesCollection() {
    return this.http.get(
      `${this.mAuth.APIUrl}/collection/likes`,
      this.httpOptions
    );
  }

  getPostsCollection() {
    return this.http.get(
      `${this.mAuth.APIUrl}/collection/posts`,
      this.httpOptions
    );
  }

  postCollection(content: any) {
    this.http
      .post<any>(`${this.mAuth.APIUrl}/collection`, content, this.httpOptions)
      .subscribe();
  }

  patchCollection(colId: string, content: any) {
    this.http
      .patch<any>(
        `${this.mAuth.APIUrl}/collection/${colId}`,
        content,
        this.httpOptions
      )
      .subscribe();
  }

  deleteCollection(colId: string) {
    this.http
      .delete<any>(`${this.mAuth.APIUrl}/collection/${colId}`, this.httpOptions)
      .subscribe();
  }
}
