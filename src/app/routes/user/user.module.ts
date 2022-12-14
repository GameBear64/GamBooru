import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IdComponent } from './id/id.component';
import { SettingsComponent } from './settings/settings.component';

import { MasterGuardGuard } from '../master-guard.guard';

import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

const routes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [MasterGuardGuard],
  },
  { path: ':id', component: IdComponent },
  { path: '', component: IdComponent },
];

@NgModule({
  declarations: [IdComponent, SettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxTrimDirectiveModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class UserModule {}
