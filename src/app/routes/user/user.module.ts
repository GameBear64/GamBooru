import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { IdComponent } from './id/id.component';
import { SettingsComponent } from './settings/settings.component';
import { RatingsComponent } from './ratings/ratings.component';

const routes: Routes = [
  { path: 'ratings', component: RatingsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: ':id', component: IdComponent },
  { path: '', component: IdComponent },
];

@NgModule({
  declarations: [IdComponent, SettingsComponent, RatingsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class UserModule {}
