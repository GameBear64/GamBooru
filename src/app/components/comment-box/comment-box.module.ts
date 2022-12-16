import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommentBoxComponent } from './comment-box.component';

import { ModalModule } from 'src/app/components/modal/modal.module';

@NgModule({
  declarations: [CommentBoxComponent],
  imports: [CommonModule, RouterModule, ModalModule],
  exports: [CommentBoxComponent],
})
export class CommentBoxModule {}
