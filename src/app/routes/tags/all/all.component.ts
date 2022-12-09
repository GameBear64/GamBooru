import { Component, OnInit } from '@angular/core';
import { MasterAuthService } from '../../master-auth.service';
import { TagsService } from '../tags.service';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss'],
})
export class AllComponent implements OnInit {
  constructor(
    protected tagService: TagsService,
    protected mAuth: MasterAuthService
  ) {}

  tags: any;

  ngOnInit(): void {
    this.tagService
      .getTags()
      .subscribe((data) => (this.tags = this.groupByCategory(data)));
  }

  groupByCategory(tags: any) {
    return tags.tags.reduce((groups: any, tag: any) => {
      const group = groups[tag.category] || [];
      group.push(tag);
      groups[tag.category] = group;
      return groups;
    }, {});
  }
}
