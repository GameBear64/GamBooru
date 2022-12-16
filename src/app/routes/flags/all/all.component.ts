import { FlagsService } from './../flags.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss'],
})
export class AllComponent implements OnInit {
  constructor(
    private flagService: FlagsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  flags!: any;
  resolveModal: string | false = false;

  ngOnInit(): void {
    let specificParent = this.route.snapshot.params?.['id'] || false;

    if (specificParent) {
      this.flagService
        .getFlags(specificParent)
        .subscribe((data) => (this.flags = data));
    } else {
      this.flagService.getAllFlags().subscribe((data) => (this.flags = data));
    }
  }

  get allFlagsResolved() {
    return this.flags.every((flag: any) => flag.resolved);
  }

  get noResolvedFlags() {
    return this.flags.every((flag: any) => !flag.resolved);
  }

  goToPost(flag: any) {
    if (flag.type == 'Comment') {
      this.goToPostFromCommentId(flag.parent);
    } else {
      this.router.navigate(['/gallery', flag.parent]);
    }
  }

  goToPostFromCommentId(commentId: string) {
    this.flagService.getParentOfComment(commentId).subscribe((data) => {
      this.router.navigate(['/gallery', data], { fragment: commentId });
    });
  }

  toggleResolve(flagId?: string) {
    this.resolveModal = flagId || false;
  }

  resolve(flagId: any) {
    this.flagService.resolveFlag(flagId);
    setTimeout(() => {
      this.flagService.getAllFlags().subscribe((data) => (this.flags = data));
    }, 300);
  }
}
