import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MasterAuthService } from '../master-auth.service';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  constructor(private http: HttpClient, private mAuth: MasterAuthService) {}

  getComments() {
    return this.http.get(`${this.mAuth.APIUrl}/comment/`);
  }
}
