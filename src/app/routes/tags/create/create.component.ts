import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

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

  form!: FormGroup;
  categories!: [String];

  ngOnInit(): void {
    this.tagService
      .getCategories()
      .subscribe((data: any) => (this.categories = data));

    this.form = this.fb.group({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      description: new FormControl(null, [
        Validators.required,
        Validators.minLength(50),
      ]),
      category: new FormControl(null, [Validators.required]),
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
