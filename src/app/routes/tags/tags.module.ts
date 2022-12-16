import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AllComponent } from './all/all.component';
import { SingleComponent } from './single/single.component';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';

import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { ModalModule } from 'src/app/components/modal/modal.module';

import { MasterGuardGuard } from '../master-guard.guard';

const routes: Routes = [
  { path: '', component: AllComponent },
  {
    path: 'create',
    component: CreateComponent,
    canActivate: [MasterGuardGuard],
  },
  { path: ':id', component: SingleComponent },
];

@NgModule({
  declarations: [AllComponent, SingleComponent, CreateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxTrimDirectiveModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
  ],
})
export class TagsModule {}
