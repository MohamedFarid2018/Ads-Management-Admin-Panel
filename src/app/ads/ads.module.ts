import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdsListComponent } from './ads-list/ads-list.component';
import { AdHomeComponent } from './ads-home/ads-home.component';
import { AdCreateComponent } from './ad-create/ad-create.component';
import { AdUpdateComponent } from './ad-update/ad-update.component';
import { AdViewComponent } from './ad-view/ad-view.component';
import { RouterModule } from '@angular/router';
import { adRoutes } from './ads.routes';
import { SharedModule } from '../shared/shared.module';
import { UploadService } from '../services/upload.service';
import { AdsService } from '../services/ads.service';
import { UsersService } from '../services/users.service';
import { TagsService } from '../services/tags.service';
import { CategoriesService } from '../services/categories.service';

@NgModule({
  declarations: [
    AdsListComponent,
    AdHomeComponent,
    AdCreateComponent,
    AdUpdateComponent,
    AdViewComponent,
  ],
  imports: [CommonModule, SharedModule, RouterModule.forChild(adRoutes)],
  providers: [
    UploadService,
    AdsService,
    UsersService,
    TagsService,
    CategoriesService,
  ],
})
export class AdModule {}
