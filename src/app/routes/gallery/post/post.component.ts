import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TagsService } from '../../tags/tags.service';
import { GalleryService } from '../gallery.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  constructor(
    private galleryService: GalleryService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private tagService: TagsService
  ) {}

  postId!: string;
  post: any;
  editMode = false;
  form!: FormGroup;
  editTags!: any;
  commentSection!: FormGroup;

  ngOnInit(): void {
    this.postId = this.route.snapshot.params['id'];

    this.galleryService
      .getPost(this.postId)
      .subscribe((data) => (this.post = data));

    this.form = this.fb.group({
      source: new FormControl(null, [Validators.required]),
      tags: new FormControl([], [Validators.required]),
    });

    this.commentSection = this.fb.group({
      comment: new FormControl(null),
    });
  }

  refresh() {
    setTimeout(() => {
      this.galleryService
        .getPost(this.postId)
        .subscribe((data) => (this.post = data));
    }, 500);
  }

  toggleEditMode() {
    this.tagService
      .getTags()
      .subscribe((data: any) => (this.editTags = data.tags));

    this.form.patchValue({ tags: this.post.tags.map((tag: any) => tag._id) });
    this.form.patchValue({ source: this.post.source });

    this.editMode = !this.editMode;
  }

  editSubmit() {
    this.editMode = false;
    this.galleryService.patchPost(this.postId, this.form.value);
    this.form.reset();

    this.refresh();
  }

  commentSubmit() {
    this.galleryService.postComment(this.postId, this.commentSection.value);
    this.commentSection.reset();

    this.refresh();
  }
}
