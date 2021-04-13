import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from '../../directives/sortable.directive';

interface SearchResult {
  generalArr: [];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(arrAny, column: SortColumn, direction: string) {
  if (direction === '' || column === '') {
    return arrAny;
  } else {
    return [...arrAny].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(obj, term: string, pipe: PipeTransform) {
  return (
    (obj.name && obj.name.toLowerCase().includes(term.toLowerCase())) ||
    (obj.content && obj.content.toLowerCase().includes(term.toLowerCase())) ||
    (obj.title && obj.title.toLowerCase().includes(term.toLowerCase())) ||
    (obj.description &&
      obj.description.toLowerCase().includes(term.toLowerCase())) ||
    (obj.price && pipe.transform(obj.price).includes(term)) ||
    (obj.likes && pipe.transform(obj.likes).includes(term)) ||
    (obj.commentsCount && pipe.transform(obj.commentsCount).includes(term)) ||
    (obj.pricePerMonth && pipe.transform(obj.pricePerMonth).includes(term)) ||
    (obj.pricePerHour && pipe.transform(obj.pricePerHour).includes(term)) ||
    (obj.firstName &&
      obj.firstName.toLowerCase().includes(term.toLowerCase())) ||
    (obj.lastName && obj.lastName.toLowerCase().includes(term.toLowerCase())) ||
    (obj.email && obj.email.toLowerCase().includes(term.toLowerCase())) ||
    (obj.packages && obj.packages.toLowerCase().includes(term.toLowerCase())) ||
    (obj.phone && obj.phone.toLowerCase().includes(term.toLowerCase())) ||
    (obj.address && obj.address.toLowerCase().includes(term.toLowerCase())) ||
    (obj.availability &&
      obj.availability.toLowerCase().includes(term.toLowerCase())) ||
    (obj.facilities &&
      obj.facilities.length &&
      obj.facilities.toLowerCase().includes(term.toLowerCase())) ||
    (obj.seats && pipe.transform(obj.seats).includes(term)) ||
    (obj.createdAt && obj.createdAt.includes(term.toLowerCase()))
  );
}

@Injectable({ providedIn: 'root' })
export class GenralTableService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _general$ = new BehaviorSubject([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };

  sharingData = [];
  // Observable string source
  private dataStringSource = new BehaviorSubject<any>(null);
  // Observable string stream
  dataString$ = this.dataStringSource.asObservable();

  public saveData(value) {
    this.sharingData = value;
    this.dataStringSource.next(this.sharingData);
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._general$.next(result.generalArr);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  constructor(private pipe: DecimalPipe) {}

  get general$() {
    return this._general$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {
      sortColumn,
      sortDirection,
      pageSize,
      page,
      searchTerm,
    } = this._state;

    // 1. sort
    let generalArr = sort(this.sharingData, sortColumn, sortDirection);
    // 2. filter
    generalArr = generalArr.filter((obj) =>
      matches(obj, searchTerm, this.pipe)
    );
    const total = generalArr[0] ? generalArr[0].totalCount : 0;
    // 3. paginate
    // generalArr = generalArr.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ generalArr, total });
  }
}
