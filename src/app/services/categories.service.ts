import { baseUrl } from './globlas';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as globlas from './globlas';
@Injectable()
export class CategoriesService {
  constructor(
    private httpClient: HttpClient,
    private gtn: globlas.GetTokenNow
  ) { }

  addCategory(body) {
    return this.httpClient.post(baseUrl + '/categories', body).pipe(
      map(res => {
        return res as any;
      })
    );
  }
  updateCategory(categoryId, body) {
    return this.httpClient.put(baseUrl + '/categories/' + categoryId, body).pipe(
      map(res => {
        return res as any;
      })
    );
  }
  deleteCategory(categoryId) {
    return this.httpClient.delete(baseUrl + '/categories/' + categoryId, this.gtn.headers()).pipe(
      map(res => {
        return res as any;
      })
    );
  }
  listCategories(page, limit, quries?) {
    const updateQueries: any = this.gtn.headers();
    updateQueries.params = quries;
    return this.httpClient.get(baseUrl + `/categories?page=${page}&limit=${limit}&pagination=true`, updateQueries).pipe(
      map(res => {
        return res as any;
      })
    );
  }

  viewCategory(categoryId) {
    return this.httpClient.get(baseUrl + '/categories/' + categoryId, this.gtn.headers()).pipe(
      map(res => {
        return res as any;
      })
    );
  }
  listAllCategories() {
    return this.httpClient.get(baseUrl + '/categories', this.gtn.headers()).pipe(
      map(res => {
        return res as any;
      })
    );
  }

  getClientPackages(clientId) {
    return this.httpClient.get(baseUrl + `/categories/${clientId}/packages`, this.gtn.headers()).pipe(
      map(res => {
        return res as any;
      })
    );
  }
}
