import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './routes/index/index.component';
import { NotFoundComponent } from './routes/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: IndexComponent },
  {
    path: 'gallery',
    loadChildren: () =>
      import('./routes/gallery/gallery.module').then((m) => m.GalleryModule),
  },
  {
    path: 'tags',
    loadChildren: () =>
      import('./routes/tags/tags.module').then((m) => m.TagsModule),
  },
  {
    path: 'comments',
    loadChildren: () =>
      import('./routes/comments/comments.module').then((m) => m.CommentsModule),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./routes/user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./routes/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./routes/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard],
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
