import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MasterAuthService } from 'src/app/routes/master-auth.service';
import { CommentBoxService } from './comment-box.service';

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

  @Input() highlight = false;
  @Input() disableActions = false;
  @Input() comment!: any;
  @Output() refresh = new EventEmitter<string>();

  like() {
    this.commentService.like(this.comment?._id);
    this.refresh.emit();
  }

  edit() {
    let edit = prompt('New content of your comment:', this.comment.body);
    if (!edit) return alert('Comment cant be empty');

    this.commentService.edit(this.comment?._id, edit!);
    this.refresh.emit();
  }

  flag() {
    let reason = prompt(
      'Whats the problem, please describe with as much detail as possible'
    );
    if (!reason || reason.length < 20)
      return alert(
        'No reason provided or reason is too short, it must be at least 20 characters long. \nKeep in mind false flags can lead to suspension of your account so please flag responsibly. \n\nCurrent flag abandoned.'
      );
    if (
      confirm(
        `You want to report this post for the following reason: \n${reason} \n\nProceed?`
      )
    ) {
      alert('Report has been send to moderation, thank you for your time.');
      this.commentService.flag(this.comment?._id, reason!);
      this.refresh.emit();
    }
  }

  delete() {
    if (this.mAuth?.loggedIn?.user?._id === this.comment.author._id) {
      if (
        confirm(
          `Are you sure you want to delete this? This action cannot be undone.`
        )
      ) {
        this.commentService.delete(this.comment?._id);
        this.refresh.emit();
      }
    } else {
      if (
        confirm(
          `Since you are not the original poster you have voted for this post's deletion. \n\nPost will be deleted when enough people vote for this. \nProceed?`
        )
      ) {
        this.commentService.voteDelete(this.comment?._id);
        this.refresh.emit();
      }
    }
  }
}
