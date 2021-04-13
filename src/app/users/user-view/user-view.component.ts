import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {
  user: any;
  userId: any;
  constructor(
    private activeRoute: ActivatedRoute,
    private userService: UsersService,
  ) { }

  ngOnInit(): void {
    this.userId = this.activeRoute.snapshot.params.id;
    if (this.userId) {
      this.viewUser();
    }
  }
  viewUser() {
    this.userService.viewUser(this.userId).subscribe(
      response => {
        if (response) {
          this.user = response;
        }
      }
    );
  }
}
