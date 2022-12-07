import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
    private route: ActivatedRoute,
    private fb: FormBuilder
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
      description: new FormControl(this.tag?.description, [
        Validators.required,
        Validators.minLength(50),
      ]),
      category: new FormControl(this.tag?.category, [Validators.required]),
    });
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
