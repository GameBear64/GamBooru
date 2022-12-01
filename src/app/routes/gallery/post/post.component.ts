import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    private tagService: TagsService,
    private router: Router
  ) {}

  postId!: string;
  post: any;
  editMode = false;
  form!: FormGroup;
  editTags!: any;
  commentSection!: FormGroup;

  ngOnInit(): void {
    this.postId = this.route.snapshot.params['id'];

    this.refresh(0);

    this.form = this.fb.group({
      source: new FormControl(null, [Validators.required]),
      tags: new FormControl([], [Validators.required]),
    });

    this.commentSection = this.fb.group({
      comment: new FormControl(null),
    });
  }

  refresh(timeout = 100) {
    setTimeout(() => {
      this.galleryService.getPost(this.postId).subscribe({
        next: (data: any) => (this.post = data),
        error: (error) => this.router.navigate(['/gallery']),
      });
    }, timeout);
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

  like() {
    this.galleryService.postLike(this.postId);
    this.refresh();
  }

  flag() {
    let reason = prompt(
      'Whats the problem, please describe with as much detail as possible'
    );
    if (!reason || reason.length < 20)
      return alert(
        'No reason provided or reason is too short, it must be at least 20 characters long. \nKeep in mind false flags can lead to suspension of your account so please flag responsibly. \n\nCurrent flag abandoned.'
      );
    if (
      confirm(
        `You want to report this post for the following reason: \n${reason} \n\nProceed?`
      )
    ) {
      alert('Report has been send to moderation, thank you for your time.');
      this.galleryService.postFlag(this.postId, reason);
      this.refresh();
    }
  }

  delete() {
    if (
      confirm(
        `Are you sure you want to delete this? This action cannot be undone.`
      )
    ) {
      this.galleryService.postDelete(this.postId);
      this.refresh();
    }
  }
}
