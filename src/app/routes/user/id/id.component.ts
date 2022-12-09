import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterAuthService } from '../../master-auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-id',
  templateUrl: './id.component.html',
  styleUrls: ['./id.component.scss'],
})
export class IdComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    protected mAuth: MasterAuthService,
    private userService: UserService
  ) {}

  userId!: string;
  user!: any;

  ngOnInit(): void {
    this.userId =
      this.route.snapshot.params['id'] || this.mAuth?.loggedIn?.user?._id;

    this.userService
      .getUser(this.userId)
      .subscribe((data) => (this.user = data));
  }
}
