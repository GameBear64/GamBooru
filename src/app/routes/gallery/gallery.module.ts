import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { PageComponent } from './page/page.component';
import { PostComponent } from './post/post.component';
import { CollectionComponent } from './collection/collection.component';
import { UploadComponent } from './upload/upload.component';

import { GalleryGuardGuard } from './gallery-guard.guard';

import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: 'upload',
    component: UploadComponent,
    canActivate: [GalleryGuardGuard],
  },
  { path: 'collection/:id', component: CollectionComponent },
  { path: ':id', component: PostComponent },
  { path: '', component: PageComponent },
];

@NgModule({
  declarations: [
    PageComponent,
    PostComponent,
    CollectionComponent,
    UploadComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class GalleryModule {}
