'use strict';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

export let baseUrl = 'http://localhost:3000/api';

@Injectable()
export class GetTokenNow {
    subscribtion: any;
    constructor() { }
    headers() {
        let headersNow: HttpHeaders = new HttpHeaders();
        headersNow = headersNow.append('Content-Type', 'application/json');
        headersNow = headersNow.append('Authorization', localStorage.getItem('token'));
        headersNow = headersNow.append('params', '');
        return { headers: headersNow };
    }
    formDataHeaders() {
        let headersNow: HttpHeaders = new HttpHeaders();
        headersNow = headersNow.append('Content-Type', "multipart/form-data");
        headersNow = headersNow.append('Authorization', localStorage.getItem('token'));
        headersNow = headersNow.append('params', '');
        return { headers: headersNow };
    }
}

