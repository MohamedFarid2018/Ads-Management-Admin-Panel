import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { cliensRoutes } from './tags.routes';
import { SharedModule } from '../shared/shared.module';
import { TagsService } from '../services/tags.service';
import { TagsAddComponent } from './tag-add/tag-add.component';
import { TagsListComponent } from './tags-list/tags-list.component';
import { TagsHomeComponent } from './tags-home/tags-home.component';
import { TagsUpdateComponent } from './tag-update/tag-update.component';
import { TagViewComponent } from './tag-view/tag-view.component';

@NgModule({
  declarations: [TagsHomeComponent, TagsAddComponent, TagsUpdateComponent, TagsListComponent, TagViewComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(cliensRoutes)
  ],
  providers: [
    TagsService,
  ]
})
export class TagsModule { }
