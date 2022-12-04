import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PageComponent } from './page/page.component';
import { PostComponent } from './post/post.component';

const routes: Routes = [
  { path: '', component: PageComponent },
  { path: ':page', component: PageComponent },
  { path: 'post/:id', component: PostComponent },
];

@NgModule({
  declarations: [PageComponent, PostComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class CommentsModule {}
