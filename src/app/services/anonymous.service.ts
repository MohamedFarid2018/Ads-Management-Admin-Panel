import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, NavigationCancel } from '@angular/router';

@Injectable()
export class AnonymousService implements CanActivate {
    constructor(private router: Router) { }
    canActivate() {
        // just from now
        const token = localStorage.getItem('token');
        if (!token) {
            return true;
        }
        this.router.navigate(['/admins']);
        return false;
    }
}
