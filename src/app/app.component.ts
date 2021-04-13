import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { WatchStorageService } from './services/watchstorage.service';
import { ActivatedRoute, CanActivate } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  isCollapsed = false;
  isAuth = localStorage.getItem('token');
  constructor(
    private renderer: Renderer2,
    private router: Router,
    private watchStorage: WatchStorageService,
    private activeRouter: ActivatedRoute
  ) {
    if (!this.isAuth) {
      // this.router.navigate(['/login']);
    }
    const params = activeRouter.queryParams['_value'];
    this.activeRouter.queryParams
      .subscribe(params => {
        if(params.view && params.view === 'mobile') {
          document.getElementById("sidebar").style.display = 'none';
        }
      }
    );

    window.onload = () => {
      const ele = document.querySelector('.loader');
      this.renderer.addClass(ele, 'hidden');
    };
    this.watchStorage.watchStorage().subscribe(res => {
      if (res) {
        this.isAuth = localStorage.getItem('token');
      }
    });
  }
  checkMenuShow(event) {
    this.isCollapsed = event;
  }
}
