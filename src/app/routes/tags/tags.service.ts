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
    return this.http.get<String[]>('http://localhost:3030/tags/categories');
  }

  getTags() {
    return this.http.get('http://localhost:3030/tags');
  }

  getTag(tagId: string) {
    return this.http.get('http://localhost:3030/tags/' + tagId);
  }

  post(content: any) {
    this.http
      .post<any>('http://localhost:3030/tags', content, this.httpOptions)
      .subscribe({
        next: (data) => {
          console.log(data);
        },
      });
  }
}
