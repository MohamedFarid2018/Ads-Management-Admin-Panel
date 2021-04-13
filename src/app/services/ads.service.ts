import { baseUrl } from './globlas';
import { map } from 'rxjs/operators';
import * as globlas from './globlas';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AdsService {
  jwtHelper = new JwtHelperService();

  constructor(
    private httpClient: HttpClient,
    private gtn: globlas.GetTokenNow
  ) {}

  userDecodeJWT() {
    if (!localStorage.getItem('token')) {
      return false;
    }
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    return token;
  }

  lisAds(page, limit, quries?) {
    const updateQueries: any = this.gtn.headers();
    updateQueries.params = quries;
    return this.httpClient
      .get(
        baseUrl +
          `/ads?page=${page}&limit=${limit}&pagination=true`,
        updateQueries
      )
      .pipe(
        map((res) => {
          return res as any;
        })
      );
  }
  
  getCurrentAd(currentAd) {
    return this.httpClient
      .get(baseUrl + '/ads/' + currentAd, this.gtn.headers())
      .pipe(
        map((res) => {
          return res as any;
        })
      );
  }
  createAd(body) {
    return this.httpClient
      .post(baseUrl + `/ads`, body, )
      .pipe(
        map((res) => {
          return res as any;
        })
      );
  }
  updatAd(body, currentAd) {
    return this.httpClient
      .put(
        baseUrl + `/ads/${currentAd}`,
        body
      )
      .pipe(
        map((res) => {
          return res as any;
        })
      );
  }

  deleteAd(currentAd) {
    return this.httpClient
      .delete(baseUrl + `/ads/${currentAd}`, this.gtn.headers())
      .pipe(
        map((res) => {
          return res as any;
        })
      );
  }
  listAllAds() {
    return this.httpClient
      .get(baseUrl + `/ads`, this.gtn.headers())
      .pipe(
        map((res) => {
          return res as any;
        })
      );
  }
}
