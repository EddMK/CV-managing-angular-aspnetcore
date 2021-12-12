
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User, Mastering } from '../models/User';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToClass } from 'class-transformer';

@Injectable({ providedIn: 'root' })
export class MasteringService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getAll(): Observable<Mastering[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/Mastering`)
            .pipe(map(res => plainToClass(Mastering, res))
        );
    }
    
}

