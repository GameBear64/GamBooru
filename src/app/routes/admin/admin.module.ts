import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MembersComponent } from './members/members.component';
import { FlagsComponent } from './flags/flags.component';
import { HistoryComponent } from './history/history.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'users', component: MembersComponent },
  { path: 'flags', component: FlagsComponent },
  { path: 'history', component: HistoryComponent },
];

@NgModule({
  declarations: [
    DashboardComponent,
    MembersComponent,
    FlagsComponent,
    HistoryComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AdminModule {}
