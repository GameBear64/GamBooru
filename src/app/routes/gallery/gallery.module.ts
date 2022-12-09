import {
  NgModule,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { PageComponent } from './page/page.component';
import { PostComponent } from './post/post.component';
import { UploadComponent } from './upload/upload.component';

import { TagListModule } from 'src/app/components/tag-list/tag-list.module';
import { CommentBoxModule } from 'src/app/components/comment-box/comment-box.module';

import { MasterGuardGuard } from '../master-guard.guard';

import { NgSelectModule } from '@ng-select/ng-select';
import { LinkifyPipe } from 'src/app/components/helpers/linkify.pipe';

const routes: Routes = [
  {
    path: 'upload',
    component: UploadComponent,
    canActivate: [MasterGuardGuard],
  },
  { path: 'page/:page', component: PageComponent },
  { path: ':id', component: PostComponent },
  { path: '', component: PageComponent },
];

@NgModule({
  declarations: [PageComponent, PostComponent, UploadComponent, LinkifyPipe],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    TagListModule,
    CommentBoxModule,
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class GalleryModule {}
