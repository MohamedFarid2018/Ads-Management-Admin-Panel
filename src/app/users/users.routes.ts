import { Routes } from '@angular/router';
import { UsersHomeComponent } from './users-home/users-home.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserViewComponent } from './user-view/user-view.component';

export const cliensRoutes: Routes = [
    {
        path: '',
        component: UsersHomeComponent,
        children: [
            {
              path: '',
              redirectTo: 'list'
            },
            {
                path: 'list',
                component: UsersListComponent
            },
            {
              path: 'view/:id',
              component: UserViewComponent
            }
        ]
    }
];
