import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { MustMatch } from 'src/app/components/helpers/must-match.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(private fb: FormBuilder, private authService: AuthService) {}

  registerForm!: FormGroup;

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
          ],
        ],
        confirmPassword: '',
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      } as AbstractControlOptions
    );
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.authService.register(this.registerForm.value);
    this.registerForm.reset();
  }
}
