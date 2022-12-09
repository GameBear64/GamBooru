import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterAuthService } from '../../master-auth.service';

import { TagsService } from '../../tags/tags.service';
import { GalleryService } from '../gallery.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit {
  constructor(
    protected galleryService: GalleryService,
    private tagService: TagsService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    protected mAuth: MasterAuthService
  ) {}

  posts: any;
  visibleTags: { _id: string; name: string; category: string }[] = [];
  tags!: any;
  searchForm!: FormGroup;
  availablePages!: number;

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      tags: [this.route.snapshot.queryParams?.['tags']],
      order: this.route.snapshot.queryParams?.['order'] || 'byDate',
      page: 1,
    });

    this.tagService.getTags().subscribe((data: any) => {
      this.tags = data.tags;

      this.getPage(this.searchForm.value);
    });

    this.route.paramMap.subscribe((paramMap) => {
      this.searchForm.patchValue({ page: Number(paramMap.get('page') || '1') });

      this.getPage(this.searchForm.value);
    });

    this.galleryService
      .getCount()
      .subscribe((data: any) => (this.availablePages = data.pages));
  }

  startSearch() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        tags: this.searchForm.value.tags,
        order: this.searchForm.value.order,
      },
    });

    this.getPage(this.searchForm.value);
  }

  getPage(query: { page: number; tags: string[]; order: string }) {
    let tagIds;

    if (this.tags?.length > 0) {
      tagIds = this.tags
        .filter((tag: any) => query?.tags?.includes(tag.name))
        .map((tag: any) => tag._id);
    } else {
      tagIds = [];
    }

    this.galleryService
      .getPosts(query.page, { tags: tagIds, order: query.order })
      .subscribe((data: any) => {
        this.posts = data;

        this.getVisibleTags(data);
      });
  }

  getVisibleTags(fromPosts: any) {
    let tempArr: any = [];
    fromPosts.forEach((post: any) => {
      post.tags.forEach((tag: any) => {
        if (tempArr.every((visibleTag: any) => visibleTag.name !== tag.name)) {
          tempArr.push(tag);
        }
      });
    });

    this.visibleTags = [...tempArr];
  }
}
