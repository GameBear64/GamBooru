import { Component, Input, OnChanges, OnInit } from '@angular/core';

// interface tagInterface {
//   _id: string;
//   name: string;
//   category: string;
// }

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss'],
})
export class TagListComponent implements OnInit, OnChanges {
  constructor() {}

  @Input() tags?: any;

  ngOnInit(): void {
    // console.log(this.tags);
  }

  ngOnChanges() {
    this.tags = this.groupByCategory(this.tags as any);
  }

  groupByCategory(tags: any) {
    return tags.reduce((groups: any, tag: any) => {
      const group = groups[tag.category] || [];
      group.push(tag);
      groups[tag.category] = group;
      return groups;
    }, {});
  }
}
