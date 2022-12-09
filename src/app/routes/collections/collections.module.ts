import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MasterGuardGuard } from '../master-guard.guard';

import { CreateComponent } from './create/create.component';
import { IdComponent } from './id/id.component';

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
    FormsModule,
    ReactiveFormsModule,
    TagListModule,
  ],
})
export class CollectionsModule {}
