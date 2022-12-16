import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MasterAuthService } from 'src/app/routes/master-auth.service';
import { CommentBoxService } from './comment-box.service';

import Snackbar from 'awesome-snackbar';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.scss'],
})
export class CommentBoxComponent {
  constructor(
    private commentService: CommentBoxService,
    protected mAuth: MasterAuthService
  ) {}

  deleteModal = false;
  flagModal = false;
  editModal = false;

  @Input() highlight = false;
  @Input() disableActions = false;
  @Input() comment!: any;
  @Output() refresh = new EventEmitter<string>();

  like() {
    this.commentService.like(this.comment?._id);
    this.refresh.emit();
  }

  editModalToggle() {
    this.editModal = !this.editModal;
  }

  edit(edit: string) {
    if (edit.length == 0) {
      new Snackbar("Comment can't be empty.");
    } else {
      this.commentService.edit(this.comment?._id, edit);
      this.refresh.emit();
      this.editModalToggle();
      new Snackbar('Comment updated.');
    }
  }

  flagModalToggle() {
    this.flagModal = !this.flagModal;
  }

  flag(reason: string) {
    if (reason.length < 20) {
      new Snackbar('Please provide a longer flag reason.');
    } else {
      this.commentService.flag(this.comment?._id, reason);
      this.refresh.emit();
      this.flagModalToggle();
      new Snackbar('Comment flagged.');
    }
  }

  deleteModalToggle() {
    this.deleteModal = !this.deleteModal;
  }

  delete() {
    this.commentService.delete(this.comment?._id);
    this.refresh.emit();
  }

  voteDelete() {
    if (this.comment?.deletionVotes.includes(this.mAuth.loggedIn?.user?._id)) {
      new Snackbar('You already voted to get this post deleted.');
    } else {
      this.commentService.voteDelete(this.comment?._id);
      this.refresh.emit();
      new Snackbar('Deletion vote cast.');
    }
  }
}
