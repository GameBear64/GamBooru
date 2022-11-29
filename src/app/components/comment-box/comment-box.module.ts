import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommentBoxComponent } from './comment-box.component';

@NgModule({
  declarations: [CommentBoxComponent],
  imports: [CommonModule, RouterModule],
  exports: [CommentBoxComponent],
})
export class CommentBoxModule {}
