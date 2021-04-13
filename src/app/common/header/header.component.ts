import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WatchStorageService } from '../../services/watchstorage.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isCollapsed = false;
  @Output() toggleMenu: EventEmitter<any> = new EventEmitter();
  LoggedInUser: any;
  constructor(
    private router: Router,
    private auth: AuthService,
    private watchStorage: WatchStorageService
  ) { }

  ngOnInit(): void {
    this.LoggedInUser = this.auth.getTokenDecoded();
  }
  ToggleIt() {
    this.isCollapsed = !this.isCollapsed;
    this.toggleMenu.emit(this.isCollapsed);
  }
  signOut() {
    this.watchStorage.removeItem('token');
    this.router.navigate(['login']);
  }
}
