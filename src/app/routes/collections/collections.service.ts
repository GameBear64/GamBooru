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
      'http://localhost:3030/collection/' + colId,
      this.httpOptions
    );
  }

  getLikesCollection() {
    return this.http.get(
      'http://localhost:3030/collection/likes',
      this.httpOptions
    );
  }

  postCollection(content: any) {
    this.http
      .post<any>('http://localhost:3030/collection', content, this.httpOptions)
      .subscribe({
        next: (data) => {
          console.log(data);
        },
      });
  }

  patchCollection(colId: string, content: any) {
    this.http
      .patch<any>(
        'http://localhost:3030/collection/' + colId,
        content,
        this.httpOptions
      )
      .subscribe({
        next: (data) => {
          console.log(data);
        },
      });
  }

  deleteCollection(colId: string) {
    this.http
      .delete<any>(
        'http://localhost:3030/collection/' + colId,
        this.httpOptions
      )
      .subscribe();
  }
}
