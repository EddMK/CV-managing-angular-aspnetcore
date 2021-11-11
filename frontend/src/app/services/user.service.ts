import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/User';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MemberService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getAll(): Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}api/users`)
            .pipe(map(res => res.map(m => new User(m))));
    }
}
