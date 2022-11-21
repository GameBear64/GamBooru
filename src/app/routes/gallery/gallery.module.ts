import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { CommonModule } from '@angular/common';
import { PageComponent } from './page/page.component';
import { PostComponent } from './post/post.component';
import { CollectionComponent } from './collection/collection.component';
import { RouterModule, Routes } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  { path: 'upload', component: UploadComponent },
  { path: 'post/:id', component: PostComponent },
  { path: 'collection/:id', component: CollectionComponent },
  { path: ':page', component: PageComponent },
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
