import { baseUrl } from './globlas';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as globlas from './globlas';
@Injectable()
export class TagsService {
  constructor(
    private httpClient: HttpClient,
    private gtn: globlas.GetTokenNow
  ) { }

  addTag(body) {
    return this.httpClient.post(baseUrl + '/tags', body).pipe(
      map(res => {
        return res as any;
      })
    );
  }
  updateTag(tagId, body) {
    return this.httpClient.put(baseUrl + '/tags/' + tagId, body).pipe(
      map(res => {
        return res as any;
      })
    );
  }
  deleteTag(tagId) {
    return this.httpClient.delete(baseUrl + '/tags/' + tagId, this.gtn.headers()).pipe(
      map(res => {
        return res as any;
      })
    );
  }
  listTags(page, limit, quries?) {
    const updateQueries: any = this.gtn.headers();
    updateQueries.params = quries;
    return this.httpClient.get(baseUrl + `/tags?page=${page}&limit=${limit}&pagination=true`, updateQueries).pipe(
      map(res => {
        return res as any;
      })
    );
  }

  viewTag(tagId) {
    return this.httpClient.get(baseUrl + '/tags/' + tagId, this.gtn.headers()).pipe(
      map(res => {
        return res as any;
      })
    );
  }
  listAllTags() {
    return this.httpClient.get(baseUrl + '/tags', this.gtn.headers()).pipe(
      map(res => {
        return res as any;
      })
    );
  }

  getClientPackages(clientId) {
    return this.httpClient.get(baseUrl + `/tags/${clientId}/packages`, this.gtn.headers()).pipe(
      map(res => {
        return res as any;
      })
    );
  }
}
