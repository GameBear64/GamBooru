import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MasterAuthService } from '../master-auth.service';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  constructor(private http: HttpClient, private mAuth: MasterAuthService) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      jwt: this.mAuth.loggedIn?.jwt || 'none',
    }),
  };

  getCategories() {
    return this.http.get<String[]>(`${this.mAuth.APIUrl}/tags/categories`);
  }

  getTags() {
    return this.http.get(`${this.mAuth.APIUrl}/tags`);
  }

  getTag(tagId: string) {
    return this.http.get(`${this.mAuth.APIUrl}/tags/${tagId}`);
  }

  post(content: any) {
    this.http
      .post<any>(`${this.mAuth.APIUrl}/tags`, content, this.httpOptions)
      .subscribe();
  }

  patch(tagId: string, updatedContent: any) {
    return this.http
      .patch(
        `${this.mAuth.APIUrl}/tags/${tagId}`,
        updatedContent,
        this.httpOptions
      )
      .subscribe();
  }

  voteDelete(tagId: string) {
    return this.http
      .post<any>(
        `${this.mAuth.APIUrl}/tags/voteDelete/${tagId}`,
        {},
        this.httpOptions
      )
      .subscribe();
  }
}
