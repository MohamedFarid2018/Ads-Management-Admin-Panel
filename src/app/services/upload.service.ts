import { baseUrl } from './globlas';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as globlas from './globlas';
import { Observable } from 'rxjs';


@Injectable()

export class UploadService {
  constructor(
    private httpClient: HttpClient,
    private gtn: globlas.GetTokenNow
  ) {
  }
  public upload(formData) {
    return this.httpClient.post<any>(`${baseUrl}/upload`, formData)
      .pipe(
        map(res => {
          return res as any;
        })
      );

  }


}
