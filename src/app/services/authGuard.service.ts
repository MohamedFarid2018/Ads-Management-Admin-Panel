import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminsService } from '../services/admins.service';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthGuardService implements CanActivate {
    currenRolePermission: any;
    constructor(
        private router: Router,
        private adminService: AdminsService,
        private cookieService: CookieService
    ) {

    }

    canActivate(route: ActivatedRouteSnapshot) {
        let queryToken = route.queryParams && route.queryParams.token ? route.queryParams.token : '';
        const tokenInCookies = this.cookieService.get('token') || '';
        if(!queryToken && tokenInCookies && !localStorage.getItem('token')) {
            queryToken = tokenInCookies;
        }
        if(queryToken) localStorage.setItem('token', queryToken);
        const token = localStorage.getItem('token');
        // just from now
        const decodedToken = this.adminService.userDecodeJWT();
        if (!decodedToken || (decodedToken && decodedToken.roles.includes('user'))) {
            localStorage.clear();
            // window.location.reload();
            return this.router.navigateByUrl(`/login`)
            // return; 
        }
        if(queryToken) {
            return this.router.navigateByUrl(`${route.routeConfig.path}`)
        }
        if (token) {
            return true;
        }
        return false;
    }
}
