import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './routes/index/index.component';
import { NotFoundComponent } from './routes/not-found/not-found.component';
import { MasterGuardGuard } from './routes/master-guard.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: IndexComponent },
  {
    path: 'gallery',
    loadChildren: () =>
      import('./routes/gallery/gallery.module').then((m) => m.GalleryModule),
  },
  {
    path: 'collection',
    loadChildren: () =>
      import('./routes/collections/collections.module').then(
        (m) => m.CollectionsModule
      ),
  },
  {
    path: 'tags',
    loadChildren: () =>
      import('./routes/tags/tags.module').then((m) => m.TagsModule),
  },
  {
    path: 'flags',
    loadChildren: () =>
      import('./routes/flags/flags.module').then((m) => m.FlagsModule),
    canActivate: [MasterGuardGuard],
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
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
