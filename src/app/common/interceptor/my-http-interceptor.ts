import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private message: NzMessageService,
    ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let ignore =
            typeof request.body === "undefined"
            || request.body === null
            || request.body.toString() === "[object FormData]" // <-- This solves your problem
            || request.headers.has("Content-Type");
        if (!window.navigator.onLine) {
            this.message.success('Please Check Your Internet Connection !!', {
                nzDuration: 3000
            });
            return;
        }
        if (ignore) {
            request = request.clone({
                setHeaders: {
                    'Content-Language': 'all',
                    Authorization: `${localStorage.getItem('token')}`
                }
            });
            return next.handle(request);
        }

        request = request.clone({
            setHeaders: {
                'Content-Type': 'application/json',
                'Content-Language': 'all',
                Authorization: `${localStorage.getItem('token')}`
            }
        });

        return next.handle(request).pipe(
            //   catchError(x => this.handleAuthError(x))
        ); //here use an arrow function, otherwise you may get "Cannot read property 'navigate' of undefined" on angular 4.4.2/net core 2/webpack 2.70
    }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {
        return throwError(err);
    }
}
