import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { CollectionsService } from './../collections.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private collectionService: CollectionsService,
    private router: Router
  ) {}

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [
        Validators.required,
        Validators.minLength(20),
      ]),
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.collectionService.postCollection(this.form.value);
    this.form.reset();
    setTimeout(() => {
      this.router.navigate(['/user']);
    }, 500);
  }
}
