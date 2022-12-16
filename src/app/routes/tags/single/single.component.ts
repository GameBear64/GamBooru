import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MasterAuthService } from '../../master-auth.service';
import { TagsService } from '../tags.service';
import { isUnique } from 'src/app/components/helpers/isUnique';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.scss'],
})
export class SingleComponent implements OnInit {
  constructor(
    protected tagService: TagsService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    protected mAuth: MasterAuthService
  ) {}

  deleteModal = false;
  tagId!: string;
  tag: any;
  allOtherTags: any;
  editMode = false;
  editForm!: FormGroup;
  categories!: [String];

  ngOnInit(): void {
    this.tagId = this.route.snapshot.params['id'];
    this.tagService.getTag(this.tagId).subscribe((data) => (this.tag = data));

    this.tagService
      .getCategories()
      .subscribe((data: any) => (this.categories = data));

    this.tagService
      .getTags()
      .subscribe(
        (data: any) =>
          (this.allOtherTags = data.tags.filter(
            (tag: any) => tag._id !== this.tagId
          ))
      );
  }

  toggleEdit() {
    this.editMode = !this.editMode;

    this.editForm = this.fb.group({
      name: new FormControl(this.tag?.name, [
        Validators.required,
        Validators.minLength(3),
        isUnique(this.allOtherTags.map((tag: any) => tag.name)),
      ]),
      description: new FormControl(this.tag?.description, [
        Validators.required,
        Validators.minLength(50),
      ]),
      category: new FormControl(this.tag?.category, [Validators.required]),
    });
  }

  voteLock() {
    this.tagService.voteLock(this.tagId);
    setTimeout(() => {
      this.tagService.getTag(this.tagId).subscribe((data) => (this.tag = data));
    }, 300);
  }

  voteDelete() {
    this.tagService.voteDelete(this.tagId);
    setTimeout(() => {
      this.tagService.getTag(this.tagId).subscribe((data) => (this.tag = data));
    }, 300);
  }

  get f() {
    return this.editForm.controls;
  }

  onSubmit() {
    this.editMode = false;
    this.tagService.patch(this.tag._id, this.editForm.value);
    this.editForm.reset();

    setTimeout(() => {
      this.tagService.getTag(this.tagId).subscribe((data) => (this.tag = data));
    }, 300);
  }
}
