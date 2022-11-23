import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TagsService } from '../tags.service';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.scss'],
})
export class SingleComponent implements OnInit {
  constructor(
    protected tagService: TagsService,
    private route: ActivatedRoute
  ) {}

  tag: any;

  ngOnInit(): void {
    let tagId = this.route.snapshot.params['id'];

    this.tagService.getTag(tagId).subscribe((data) => (this.tag = data));
  }
}
