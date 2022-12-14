import { Component, OnInit } from '@angular/core';
import { IndexService } from './index.service';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  constructor(private indexService: IndexService) {}

  postCount = 0;
  tagCount = 0;

  ngOnInit(): void {
    this.indexService
      .getPostCount()
      .subscribe((data) => (this.postCount = data.count));

    this.indexService
      .getTagCount()
      .subscribe((data) => (this.tagCount = data.count));
  }
}
