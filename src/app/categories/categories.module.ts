import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {categoriesRoutes} from './categories.routes';
import {SharedModule} from '../shared/shared.module';
import {CategoriesService} from '../services/categories.service';
import {CategoryAddComponent} from './category-add/category-add.component';
import {CategoryViewComponent} from './category-view/category-view.component';
import {CategoriesHomeComponent} from './categories-home/categories-home.component';
import {CategoriesListComponent} from './categories-list/categories-list.component';
import {CategoryUpdateComponent} from './category-update/category-update.component';
import {UploadService} from '../services/upload.service';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

@NgModule({
  declarations: [
    CategoriesHomeComponent,
    CategoriesListComponent,
    CategoryAddComponent,
    CategoryViewComponent,
    CategoryUpdateComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(categoriesRoutes),
    TimepickerModule.forRoot()
  ],
  providers: [
    CategoriesService,
    UploadService,
  ]
})
export class CategoriesModule {
}
