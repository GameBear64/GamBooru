import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MasterGuardGuard } from '../master-guard.guard';
import { ModalModule } from 'src/app/components/modal/modal.module';

import { CreateComponent } from './create/create.component';
import { IdComponent } from './id/id.component';

import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { TagListModule } from 'src/app/components/tag-list/tag-list.module';

const routes: Routes = [
  {
    path: 'create',
    component: CreateComponent,
    canActivate: [MasterGuardGuard],
  },
  { path: ':id', component: IdComponent },
];

@NgModule({
  declarations: [CreateComponent, IdComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxTrimDirectiveModule,
    FormsModule,
    ReactiveFormsModule,
    TagListModule,
    ModalModule,
  ],
})
export class CollectionsModule {}
