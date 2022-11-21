import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdComponent } from './id/id.component';
import { SettingsComponent } from './settings/settings.component';
import { RatingsComponent } from './ratings/ratings.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: ':?id', component: IdComponent },
  { path: 'ratings', component: RatingsComponent },
  { path: 'settings', component: SettingsComponent },
];

@NgModule({
  declarations: [IdComponent, SettingsComponent, RatingsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class UserModule {}
