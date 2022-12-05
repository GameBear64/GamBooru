import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IdComponent } from './id/id.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: 'settings', component: SettingsComponent },
  { path: ':id', component: IdComponent },
  { path: '', component: IdComponent },
];

@NgModule({
  declarations: [IdComponent, SettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class UserModule {}
