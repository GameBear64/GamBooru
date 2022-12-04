import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CreateComponent } from './create/create.component';
import { IdComponent } from './id/id.component';

const routes: Routes = [
  { path: 'create', component: CreateComponent },
  { path: ':id', component: IdComponent },
];

@NgModule({
  declarations: [CreateComponent, IdComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class CollectionsModule {}
