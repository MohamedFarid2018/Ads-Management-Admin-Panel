import { baseUrl } from './globlas';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as globlas from './globlas';
@Injectable()
export class UsersService {
  constructor(
    private httpClient: HttpClient,
    private gtn: globlas.GetTokenNow
  ) { }

  addUsers(body) {
    return this.httpClient.post(baseUrl + '/users/create', body, this.gtn.headers()).pipe(
      map(res => {
        return res as any;
      })
    );
  }
  updateUser(clientId, body) {
    return this.httpClient.put(baseUrl + '/users/' + clientId, body, this.gtn.headers()).pipe(
      map(res => {
        return res as any;
      })
    );
  }
  deleteUser(clientId) {
    return this.httpClient.delete(baseUrl + '/users/' + clientId, this.gtn.headers()).pipe(
      map(res => {
        return res as any;
      })
    );
  }
  listUsers(page, limit, quries?) {
    const updateQueries: any = this.gtn.headers();
    updateQueries.params = quries;
    return this.httpClient.get(baseUrl + `/users?page=${page}&limit=${limit}&pagination=true`, updateQueries).pipe(
      map(res => {
        return res as any;
      })
    );
  }

  checkIfmobileExist(quries?) {
    const updateQueries = this.gtn.headers();
    // updateQueries['params'] = quries;
    return this.httpClient.get(baseUrl + `/users?phone=${quries}`, updateQueries).pipe(
      map(res => {
        return res as any;
      })
    );
  }

  viewUser(clientId) {
    return this.httpClient.get(baseUrl + '/users/' + clientId, this.gtn.headers()).pipe(
      map(res => {
        return res as any;
      })
    );
  }
  listAllUsers(queries) {
    const updateQueries: any = this.gtn.headers();
    updateQueries.params = queries;
    return this.httpClient.get(baseUrl + '/users?role=user', queries).pipe(
      map(res => {
        return res as any;
      })
    );
  }

  listAllUsersForChat(queries) {
    const updateQueries: any = this.gtn.headers();
    updateQueries.params = queries;
    return this.httpClient.get(baseUrl + '/users/dashboard?role=user', queries).pipe(
      map(res => {
        return res as any;
      })
    );
  }

  listAllUsersWithType(queries) {
    const updateQueries: any = this.gtn.headers();
    updateQueries.params = queries;
    return this.httpClient.get(baseUrl + `/users`, updateQueries).pipe(
      map(res => {
        return res as any;
      })
    );
  }

}
