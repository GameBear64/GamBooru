import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AllComponent } from './all/all.component';
import { SingleComponent } from './single/single.component';

const routes: Routes = [
  { path: '', component: AllComponent },
  { path: ':id', component: SingleComponent },
];

@NgModule({
  declarations: [AllComponent, SingleComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class FlagsModule {}
