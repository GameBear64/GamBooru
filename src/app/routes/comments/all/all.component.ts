import { CommentsService } from './../comments.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss'],
})
export class AllComponent implements OnInit {
  constructor(private commentService: CommentsService) {}

  comments!: any;

  ngOnInit(): void {
    this.commentService
      .getComments()
      .subscribe((data: any) => (this.comments = data));
  }
}
