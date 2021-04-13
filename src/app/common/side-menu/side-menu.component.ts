import { Component, OnInit, Input } from '@angular/core';
import { AdminsService } from '../../services/admins.service';
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  @Input() isCollapsed;
  currenRolePermission: any;
  constructor(
    private adminService: AdminsService
  ) { }

  ngOnInit(): void {
    this.getCurrentUserRole();
  }
  getCurrentUserRole() {
    const decodedToken = this.adminService.userDecodeJWT();
    if (!decodedToken) { return; }
    this.currenRolePermission = decodedToken.roles;
  }

}
