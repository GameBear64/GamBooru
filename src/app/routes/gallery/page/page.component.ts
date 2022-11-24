import { Component, OnInit } from '@angular/core';
import { GalleryService } from '../gallery.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit {
  constructor(protected galleryService: GalleryService) {}

  posts: any;
  visibleTags: { _id: string; name: string; category: string }[] = [];

  ngOnInit(): void {
    this.galleryService.getPosts().subscribe((data: any) => {
      this.posts = data;

      this.posts.forEach((post: any) => {
        post.tags.forEach((tag: any) => {
          if (
            this.visibleTags.every(
              (visibleTag: any) => visibleTag.name !== tag.name
            )
          ) {
            this.visibleTags.push(tag);
          }
        });
      });
    });
  }
}
