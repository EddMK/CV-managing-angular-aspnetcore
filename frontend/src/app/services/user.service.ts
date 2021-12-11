import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/User';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToClass } from 'class-transformer';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getAll(): Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}api/Users`)
            .pipe(map(res => res.map(m => new User(m))));
    }
    getByEmail(email: string) {
        return this.http.get<User>(`${this.baseUrl}api/Users/${email}`).pipe(
            map(m => plainToClass(User, m)),
            catchError(err => of(null))
        );
    }

    public update(m: User): Observable<boolean> {
        return this.http.put<User>(`${this.baseUrl}api/Users`, m).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public delete(m: User): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/Users/${m.email}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public add(m: User): Observable<boolean> {
        return this.http.post<User>(`${this.baseUrl}api/members`, m).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
}
