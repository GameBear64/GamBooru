import { Component, OnInit } from '@angular/core';
import { TagsService } from '../tags.service';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss'],
})
export class AllComponent implements OnInit {
  constructor(protected tagService: TagsService) {}

  tags: any;

  ngOnInit(): void {
    this.tagService.getTags().subscribe((data) => (this.tags = data));
  }
}
