import { baseUrl } from './globlas';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthService {
    public jwtHelper: JwtHelperService = new JwtHelperService();
    constructor(
        private httpClient: HttpClient
    ) { }

    login(body) {
        return this.httpClient.post(baseUrl + '/login', body).pipe(
            map(res => {
                return res as any;
            })
        );
    }
    public getTokenDecoded(): any {
        const token = localStorage.getItem('token');
        if (token) {
            return this.jwtHelper.decodeToken(token);
        }
        return false;
    }
}
