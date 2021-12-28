import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { Enterprise } from '../models/Enterprise';

@Injectable({ providedIn: 'root' })
export class EnterpriseService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getAll(): Observable<Enterprise[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/Enterprises/`)
            .pipe(map(res => plainToClass(Enterprise, res))
        );
    }

    getByName(name: String) {
        return this.http.get<Enterprise>(`${this.baseUrl}api/Enterprises/${name}`).pipe(
            map(e => plainToClass(Enterprise, e)),
            catchError(err => of(null))
        );
    }

    public update(e : Enterprise): Observable<boolean> {
        return this.http.put<Enterprise>(`${this.baseUrl}api/Enterprises`, e).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public delete(e : Enterprise): Observable<boolean> {
        console.log("suprrime : "+e.idEnterprise);
        return this.http.delete<boolean>(`${this.baseUrl}api/Enterprises/${e.idEnterprise}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public add(e: Enterprise): Observable<boolean> {
        console.log(e);
        return this.http.post<Enterprise>(`${this.baseUrl}api/Enterprises`, e).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
}