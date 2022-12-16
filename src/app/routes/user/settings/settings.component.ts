import { Component, OnInit } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MustMatch } from 'src/app/components/helpers/must-match.validator';
import { MasterAuthService } from '../../master-auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private mAuth: MasterAuthService,
    private userService: UserService,
    private router: Router
  ) {}

  form?: FormGroup;
  passwordReset!: FormGroup;

  user!: any;
  userId = this.mAuth?.loggedIn?.user?._id || '';

  ngOnInit(): void {
    this.userService.getUser(this.userId).subscribe((data: any) => {
      this.user = data;

      this.form = this.fb.group({
        username: new FormControl(data.username, [
          Validators.required,
          Validators.minLength(3),
        ]),
        biography: new FormControl(data.biography, [Validators.minLength(20)]),
      });
    });

    this.passwordReset = this.fb.group(
      {
        password: new FormControl(null),
        confirmPassword: new FormControl(null),
        newPass: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        ]),
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      } as AbstractControlOptions
    );
  }

  get f() {
    return this.form?.controls;
  }
  get f2() {
    return this.passwordReset?.controls;
  }

  onSubmit() {
    this.userService.updateUser(this.form?.value || {});
    setTimeout(() => {
      this.userService
        .getUser(this.userId)
        .subscribe((data: any) => (this.user = data));
    }, 300);
  }

  onSubmitPassword() {
    this.userService.resetPassword(this.passwordReset.value);
    this.passwordReset.reset();
    setTimeout(() => {
      this.userService
        .getUser(this.userId)
        .subscribe((data: any) => (this.user = data));
    }, 300);
  }

  deleteUser() {
    this.userService.deleteUser();
    this.router.navigate(['/']);
  }
}

// todo:
//  - deletion vote
//  - styles
