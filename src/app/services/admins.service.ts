import { baseUrl } from './globlas';
import { map } from 'rxjs/operators';
import * as globlas from './globlas';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable()

export class AdminsService {

    jwtHelper = new JwtHelperService();

    constructor(
        private httpClient: HttpClient,
        private gtn: globlas.GetTokenNow
    ) { }

    userDecodeJWT() {
        if (!localStorage.getItem('token')) {
            return false;
        }
        const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
        return token;
    }

    listAdmins(page, limit, quries?) {
        const updateQueries: any = this.gtn.headers();
        updateQueries.params = quries;
        return this.httpClient.get(baseUrl + `/users?role=admin&page=${page}&limit=${limit}&pagination=true`, updateQueries).pipe(
            map(res => {
                return res as any;
            })
        );
    }
    getCurrentAdmin(currentAdmin) {
        return this.httpClient.get(baseUrl + '/users/' + currentAdmin + '/report', this.gtn.headers()).pipe(
            map(res => {
                return res as any;
            })
        );
    }
    getAdminReport(currentAdmin) {
        return this.httpClient.get(baseUrl + '/users/' + currentAdmin + '/report', this.gtn.headers()).pipe(
            map(res => {
                return res as any;
            })
        );
    }

    getCurrentAdminBranches() {
        return this.httpClient.get(baseUrl + '/auth/admin/me/branches', this.gtn.headers()).pipe(
            map(res => {
                return res as any;
            })
        );
    }
    createAdmin(body) {
        return this.httpClient.post(baseUrl + `/users/create`, body, this.gtn.headers()).pipe(
            map(res => {
                return res as any;
            })
        );
    }
    updatAdmin(body, currentAdmin) {
        return this.httpClient.put(baseUrl + `/users/${currentAdmin}`, body, this.gtn.headers()).pipe(
            map(res => {
                return res as any;
            })
        );
    }

    deleteAdmin(currentAdmin) {
        return this.httpClient.delete(baseUrl + `/users/${currentAdmin}`, this.gtn.headers()).pipe(
            map(res => {
                return res as any;
            })
        );
    }
    listAllAdmins() {
        return this.httpClient.get(baseUrl + `/users?role=admin`, this.gtn.headers()).pipe(
            map(res => {
                return res as any;
            })
        );
    }

    getAdminBranches(currentAdmin) {
        return this.httpClient.get(baseUrl + `/users/${currentAdmin}/branches`, this.gtn.headers()).pipe(
            map(res => {
                return res as any;
            })
        );
    }
    updateAdminBranches(body, currentAdmin, currentBranch) {
        return this.httpClient.put(baseUrl + `/users/${currentAdmin}/branches/${currentBranch}`, body, this.gtn.headers()).pipe(
            map(res => {
                return res as any;
            })
        );
    }
    deleteAdminBranches(currentAdmin, currentBranch) {
        return this.httpClient.delete(baseUrl + `/users/${currentAdmin}/branches/${currentBranch}`, this.gtn.headers()).pipe(
            map(res => {
                return res as any;
            })
        );
    }
}
