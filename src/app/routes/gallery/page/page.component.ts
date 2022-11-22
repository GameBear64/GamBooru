import { Component, OnInit } from '@angular/core';
import { GalleryService } from '../gallery.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit {
  constructor(private galleryService: GalleryService) {}

  posts: any;

  ngOnInit(): void {
    this.galleryService
      .getPosts()
      .subscribe((data: any) => (this.posts = data?.posts));
  }
}
