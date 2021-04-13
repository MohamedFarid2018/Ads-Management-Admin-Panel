import { Routes } from '@angular/router';
import { CategoriesHomeComponent } from './categories-home/categories-home.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoryViewComponent } from './category-view/category-view.component';

export const categoriesRoutes: Routes = [
    {
        path: '',
        component: CategoriesHomeComponent,
        children: [
            {
                path: '',
                redirectTo: 'list'
            },
            {
                path: 'list',
                component: CategoriesListComponent
            },
            {
                path: 'view/:id',
                component: CategoryViewComponent
            }
        ]
    }
];
