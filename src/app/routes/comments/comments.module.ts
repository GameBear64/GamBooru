import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CommentBoxModule } from 'src/app/components/comment-box/comment-box.module';

import { AllComponent } from './all/all.component';

const routes: Routes = [{ path: '', component: AllComponent }];

@NgModule({
  declarations: [AllComponent],
  imports: [CommonModule, RouterModule.forChild(routes), CommentBoxModule],
})
export class CommentsModule {}
