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

  tagId!: string;
  tag: any;
  editMode = false;
  editForm!: FormGroup;
  categories!: [String];

  ngOnInit(): void {
    this.tagId = this.route.snapshot.params['id'];
    this.tagService.getTag(this.tagId).subscribe((data) => (this.tag = data));

    this.tagService
      .getCategories()
      .subscribe((data: any) => (this.categories = data));
  }

  toggleEdit() {
    this.editMode = !this.editMode;

    this.editForm = this.fb.group({
      name: new FormControl(this.tag?.name, [
        Validators.required,
        Validators.minLength(3),
      ]),
      description: new FormControl(this.tag?.description, [
        Validators.required,
        Validators.minLength(50),
      ]),
      category: new FormControl(this.tag?.category, [Validators.required]),
    });
  }

  voteLock() {}

  delete() {
    if (
      confirm(
        `Since you are not the original poster you have voted for this tags's deletion. \n\nTag will be deleted when enough people vote for this. \nProceed?`
      )
    ) {
      this.tagService.voteDelete(this.tagId);
      setTimeout(() => {
        this.tagService
          .getTag(this.tagId)
          .subscribe((data) => (this.tag = data));
      }, 300);
    }
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
