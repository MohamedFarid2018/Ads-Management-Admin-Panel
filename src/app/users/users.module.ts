import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { cliensRoutes } from './users.routes';
import { SharedModule } from '../shared/shared.module';
import { UsersService } from '../services/users.service';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersHomeComponent } from './users-home/users-home.component';
import { UserViewComponent } from './user-view/user-view.component';
import { UsersAddComponent } from './user-add/user-add.component';
import { UsersUpdateComponent } from './user-update/user-update.component';

@NgModule({
  declarations: [
    UsersHomeComponent,
    UsersListComponent,
    UserViewComponent,
    UsersAddComponent,
    UsersUpdateComponent,
  ],
  imports: [CommonModule, SharedModule, RouterModule.forChild(cliensRoutes)],
  providers: [UsersService],
})
export class UsersModule {}
