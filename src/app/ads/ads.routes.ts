import { Routes } from '@angular/router';
import { AdHomeComponent } from './ads-home/ads-home.component';
import { AdsListComponent } from './ads-list/ads-list.component';
import { AdViewComponent } from './ad-view/ad-view.component';

export const adRoutes: Routes = [
  {
    path: '',
    component: AdHomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'list'
      },
      {
        path: 'list',
        component: AdsListComponent
      },
      {
        path: 'view/:id',
        component: AdViewComponent
      }
    ]
  }
];
