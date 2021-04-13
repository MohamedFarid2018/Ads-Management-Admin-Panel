import { Routes } from '@angular/router';
import { AuthGuardService } from './services/authGuard.service';
import { AnonymousService } from './services/anonymous.service';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'ads',
    pathMatch: 'full',
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    pathMatch: 'full',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [AnonymousService]
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'tags',
    loadChildren: () => import('./tags/tags.module').then(m => m.TagsModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'ads',
    loadChildren: () => import('./ads/ads.module').then(m => m.AdModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'categories',
    loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule),
    canActivate: [AuthGuardService]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
