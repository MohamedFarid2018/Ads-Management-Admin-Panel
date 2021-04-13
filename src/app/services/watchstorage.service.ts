import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class WatchStorageService {
    private storageSub = new Subject<boolean>();
    watchStorage(): Observable<any> {
        return this.storageSub.asObservable();
    }

    setItem(key: string, data: any) {
        localStorage.setItem(key, data);
        this.storageSub.next(true);
    }

    removeItem(key) {
        localStorage.removeItem(key);
        this.storageSub.next(true);
    }
}
