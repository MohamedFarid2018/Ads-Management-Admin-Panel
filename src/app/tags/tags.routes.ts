import { Routes } from '@angular/router';
import { TagsHomeComponent } from './tags-home/tags-home.component';
import { TagsListComponent } from './tags-list/tags-list.component';
import { TagViewComponent } from './tag-view/tag-view.component';

export const cliensRoutes: Routes = [
    {
        path: '',
        component: TagsHomeComponent,
        children: [
            {
              path: '',
              redirectTo: 'list'
            },
            {
                path: 'list',
                component: TagsListComponent
            },
            {
              path: 'view/:id',
              component: TagViewComponent
            }
        ]
    }
];
