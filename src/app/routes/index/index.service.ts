import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MasterAuthService } from '../master-auth.service';

@Injectable({
  providedIn: 'root',
})
export class IndexService {
  constructor(private http: HttpClient, private mAuth: MasterAuthService) {}

  getPostCount() {
    return this.http.get<{ count: number; pages: number }>(
      `${this.mAuth.APIUrl}/post/count`
    );
  }

  getTagCount() {
    return this.http.get<{ count: number; pages: number }>(
      `${this.mAuth.APIUrl}/tags`
    );
  }
}
