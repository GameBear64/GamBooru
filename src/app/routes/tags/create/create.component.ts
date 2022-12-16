import { Component, OnInit } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { isUnique } from 'src/app/components/helpers/isUnique';

import { TagsService } from '../tags.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    protected tagService: TagsService,
    private router: Router
  ) {}

  // tags: string[] = ['sauce', 'bob'];
  form!: FormGroup;
  categories!: [String];

  ngOnInit(): void {
    this.tagService
      .getCategories()
      .subscribe((data: any) => (this.categories = data));

    this.tagService.getTags().subscribe((data: any) => {
      // this.tags = data.tags.map((tag: any) => tag.name)

      this.form = this.fb.group({
        name: new FormControl(null, [
          Validators.required,
          Validators.minLength(3),
          isUnique(data.tags.map((tag: any) => tag.name)),
        ]),
        description: new FormControl(null, [
          Validators.required,
          Validators.minLength(50),
        ]),
        category: new FormControl('Tag', [Validators.required]),
      });
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.tagService.post(this.form.value);
    this.form.reset();
    setTimeout(() => {
      this.router.navigate(['/tags']);
    }, 1000);
  }
}
