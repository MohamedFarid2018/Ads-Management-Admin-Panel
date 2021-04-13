import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from '../../directives/sortable.directive';

interface SearchResult {
    admins: [];
    total: number;
}

interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: SortColumn;
    sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(admins, column: SortColumn, direction: string) {
    if (direction === '' || column === '') {
        return admins;
    } else {
        return [...admins].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}


function matches(admin, term: string, pipe: PipeTransform) {
    return admin.firstName && admin.firstName.toLowerCase().includes(term.toLowerCase())
        || admin.lastName && admin.lastName.includes(term.toLowerCase())
        || admin.birthdate && admin.birthdate.includes(term.toLowerCase())
        || admin.phone && admin.phone.includes(term.toLowerCase())
        || admin.role && admin.role.includes(term.toLowerCase())
        || admin.email && admin.email.includes(term.toLowerCase());
}

@Injectable({ providedIn: 'root' })
export class AdminTableService {

    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _admins$ = new BehaviorSubject([]);
    private _total$ = new BehaviorSubject<number>(0);

    private _state: State = {
        page: 1,
        pageSize: 4,
        searchTerm: '',
        sortColumn: '',
        sortDirection: ''
    };


    sharingData = [];
    // Observable string source
    private dataStringSource = new BehaviorSubject<any>(null);
    // Observable string stream
    dataString$ = this.dataStringSource.asObservable();

    public saveData(value) {
        this.sharingData = value;
        this.dataStringSource.next(this.sharingData);
        this._search$.pipe(
            tap(() => this._loading$.next(true)),
            debounceTime(200),
            switchMap(() => this._search()),
            delay(200),
            tap(() => this._loading$.next(false))
        ).subscribe(result => {
            this._admins$.next(result.admins);
            this._total$.next(result.total);
        });

        this._search$.next();
    }


    constructor(private pipe: DecimalPipe) {

    }

    get admins$() { return this._admins$.asObservable(); }
    get total$() { return this._total$.asObservable(); }
    get loading$() { return this._loading$.asObservable(); }
    get page() { return this._state.page; }
    get pageSize() { return this._state.pageSize; }
    get searchTerm() { return this._state.searchTerm; }

    set page(page: number) { this._set({ page }); }
    set pageSize(pageSize: number) { this._set({ pageSize }); }
    set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
    set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
    set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
    }

    private _search(): Observable<SearchResult> {
        if (this.sharingData && this.sharingData.length) {
            const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

            // 1. sort
            let admins = sort(this.sharingData, sortColumn, sortDirection);
            // 2. filter
            admins = admins.filter(admin => matches(admin, searchTerm, this.pipe));
            const total = admins.length;

            // 3. paginate
            admins = admins.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
            return of({ admins, total });
        }
    }
}
