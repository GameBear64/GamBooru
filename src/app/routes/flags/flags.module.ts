import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AllComponent } from './all/all.component';

import { ModalModule } from 'src/app/components/modal/modal.module';

const routes: Routes = [
  { path: '', component: AllComponent },
  { path: ':id', component: AllComponent },
];

@NgModule({
  declarations: [AllComponent],
  imports: [CommonModule, RouterModule.forChild(routes), ModalModule],
})
export class FlagsModule {}
