import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalComponent } from './modal.component';

import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

@NgModule({
  declarations: [ModalComponent],
  imports: [CommonModule, NgxTrimDirectiveModule],
  exports: [ModalComponent],
})
export class ModalModule {}
