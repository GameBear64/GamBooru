import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MasterAuthService } from '../../master-auth.service';

import { TagsService } from '../../tags/tags.service';
import { GalleryService } from '../gallery.service';

import Snackbar from 'awesome-snackbar';

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
    private router: Router,
    protected mAuth: MasterAuthService
  ) {}

  deleteModal = false;
  flagModal = false;
  postId!: string;
  post: any;
  editMode = false;
  form!: FormGroup;
  editTags!: any;
  commentSection!: FormGroup;
  userCollections!:
    | null
    | {
        _id: string;
        title: string;
        posts: string[];
      }[];
  collectionForm!: FormGroup;
  collectionFormChanges = false;
  highlightComment!: string | null;

  ngOnInit(): void {
    this.highlightComment = this.route.snapshot.fragment;
    this.postId = this.route.snapshot.params['id'];

    this.refresh(0);

    this.form = this.fb.group({
      source: new FormControl(null, [Validators.required]),
      tags: new FormControl([], [Validators.required]),
    });

    this.collectionForm = this.fb.group({
      collectionTitles: new FormArray([]),
    });

    this.collectionForm
      .get('collectionTitles')
      ?.valueChanges.subscribe((_) => (this.collectionFormChanges = true));

    this.commentSection = this.fb.group({
      comment: new FormControl(null),
    });
  }

  refresh(timeout = 100) {
    setTimeout(() => {
      this.galleryService.getPost(this.postId).subscribe({
        next: (data: any) => (this.post = data),
        error: () => this.router.navigate(['/404']),
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

  flagModalToggle() {
    this.flagModal = !this.flagModal;
  }

  flag(reason: string) {
    if (reason.length < 20) {
      new Snackbar('Please provide a longer flag reason.');
    } else {
      this.galleryService.postFlag(this.postId, reason);
      this.refresh();
      this.flagModalToggle();
      new Snackbar('Post flagged.');
    }
  }

  deleteModalToggle() {
    this.deleteModal = !this.deleteModal;
  }

  delete() {
    this.galleryService.postDelete(this.postId);
    this.refresh();
  }

  voteDelete() {
    if (this.post?.deletionVotes.includes(this.mAuth.loggedIn?.user?._id)) {
      new Snackbar('You already voted to get this post deleted.');
    } else {
      this.galleryService.voteDeletePost(this.postId);
      this.refresh();
      new Snackbar('Deletion vote cast.');
    }
  }

  addToCollectionTrigger() {
    const collectionTitles = this.collectionForm.controls[
      'collectionTitles'
    ] as FormArray;

    this.galleryService
      .getCollectionList(this.mAuth?.loggedIn!.user!._id)
      .subscribe((data: any) => {
        this.userCollections = data;

        data.forEach((cols: any) => {
          if (cols.posts.includes(this.postId))
            collectionTitles.push(new FormControl(cols._id));
        });
      });
  }

  saveCollections() {
    this.galleryService.addToCollection(
      this.postId,
      this.collectionForm.value.collectionTitles
    );

    const collectionTitles = this.collectionForm.controls[
      'collectionTitles'
    ] as FormArray;
    collectionTitles.value.forEach((_: any) => {
      collectionTitles.removeAt(0);
    });

    this.userCollections = null;
    if (this.collectionFormChanges) new Snackbar('Updated');
    this.collectionFormChanges = false;
  }

  onCheckboxChange(event: any) {
    const collectionTitles = this.collectionForm.controls[
      'collectionTitles'
    ] as FormArray;
    if (event.target.checked) {
      collectionTitles.push(new FormControl(event.target.value));
    } else {
      const index = collectionTitles.controls.findIndex(
        (x) => x.value === event.target.value
      );
      collectionTitles.removeAt(index);
    }
  }
}
