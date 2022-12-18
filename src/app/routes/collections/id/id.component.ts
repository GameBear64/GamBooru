import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterAuthService } from '../../master-auth.service';
import { CollectionsService } from '../collections.service';

@Component({
  selector: 'app-id',
  templateUrl: './id.component.html',
  styleUrls: ['./id.component.scss'],
})
export class IdComponent implements OnInit {
  constructor(
    private collectionService: CollectionsService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    protected mAuth: MasterAuthService
  ) {}

  deleteModal = false;
  collectionId!: string;
  collection: any;
  visibleTags: { _id: string; name: string; category: string }[] = [];
  form!: FormGroup;
  editIsPossible = false;
  editMode = false;

  ngOnInit(): void {
    this.collectionId = this.route.snapshot.params['id'];

    if (this.collectionId == 'likes') {
      this.collectionService.getLikesCollection().subscribe((data) => {
        this.collection = {
          title: 'Likes',
          description: 'All of your liked posts',
          posts: data,
        };
        this.getVisibleTags();
      });
    } else if (this.collectionId == 'posts') {
      let ofUser =
        this.route.snapshot.fragment || this.mAuth?.loggedIn?.user?._id || '';

      this.collectionService.getPostsCollection(ofUser).subscribe((data) => {
        this.collection = {
          title: 'Posts',
          description: 'All of the posts you have posted',
          posts: data,
        };
        this.getVisibleTags();
      });
    } else {
      this.refresh(0);
    }
  }

  refresh(timeout = 300) {
    setTimeout(() => {
      this.collectionService.getCollection(this.collectionId).subscribe({
        next: (data: any) => {
          if (data == null) this.router.navigate(['/user']);

          this.collection = data;
          this.getVisibleTags();

          this.editIsPossible = true;

          this.form = this.fb.group({
            title: new FormControl(data.title, [Validators.required]),
            description: new FormControl(data.description, [
              Validators.required,
              Validators.minLength(20),
            ]),
          });
        },
        error: () => this.router.navigate(['/user']),
      });
    }, timeout);
  }

  getVisibleTags() {
    this.collection.posts.forEach((post: any) => {
      post.tags.forEach((tag: any) => {
        if (
          this.visibleTags.every(
            (visibleTag: any) => visibleTag.name !== tag.name
          )
        ) {
          this.visibleTags.push(tag);
        }
      });
    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.editMode = false;
    this.collectionService.patchCollection(this.collectionId, this.form.value);
    this.refresh();
  }

  deleteModalToggle() {
    this.deleteModal = !this.deleteModal;
  }

  delete() {
    this.collectionService.deleteCollection(this.collectionId);
    this.refresh();
  }
}
