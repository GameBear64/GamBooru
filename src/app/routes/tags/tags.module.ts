import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AllComponent } from './all/all.component';
import { SingleComponent } from './single/single.component';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';

const routes: Routes = [
  { path: '', component: AllComponent },
  { path: 'create', component: CreateComponent },
  { path: ':id', component: SingleComponent },
];

@NgModule({
  declarations: [AllComponent, SingleComponent, CreateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class TagsModule {}
