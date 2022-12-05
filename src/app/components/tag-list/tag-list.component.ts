import { Component, Input, OnChanges } from '@angular/core';

interface TagList {
  _id: string;
  name: string;
  category: string;
  count: number;
}

interface TransformedTagList {
  [key: string]: TagList[];
}

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss'],
})
export class TagListComponent implements OnChanges {
  constructor() {}

  @Input() showCategories: boolean = true;
  @Input() tags?: TagList[] | TransformedTagList[] | any;
  @Input() inline?: Boolean;

  ngOnChanges() {
    this.tags = this.groupByCategory(this.tags as TagList[]);
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
