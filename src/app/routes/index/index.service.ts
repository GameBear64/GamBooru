import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IndexService {
  constructor(private http: HttpClient) {}

  getCount() {
    return this.http.get<{ count: number }>('http://localhost:3030/post/count');
  }
}
