import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  constructor(private http: HttpClient) {}

  post(content: any) {
    console.log(content);

    this.http.post<any>('http://localhost:3030/post', content).subscribe({
      next: (data) => {
        console.log(data);
      },
    });
  }
}
