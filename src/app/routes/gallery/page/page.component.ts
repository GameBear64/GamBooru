import { Component, OnInit } from '@angular/core';
import { reduce } from 'rxjs';
import { GalleryService } from '../gallery.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit {
  constructor(private galleryService: GalleryService) {}

  posts: any;
  visibleTags!: any;

  ngOnInit(): void {
    this.galleryService.getPosts().subscribe((data) => {
      this.posts = data;

      let tagSet = new Set();
      this.posts.forEach((post: any) => {
        post.tags.forEach((tag: any) => tagSet.add(tag));
      });
      this.visibleTags = Array.from(tagSet);
    });
  }
}
