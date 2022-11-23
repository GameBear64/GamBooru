import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryService } from '../gallery.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  constructor(
    private galleryService: GalleryService,
    private route: ActivatedRoute
  ) {}

  post: any;

  ngOnInit(): void {
    let postId = this.route.snapshot.params['id'];

    this.galleryService.getPost(postId).subscribe((data) => (this.post = data));
  }
}
