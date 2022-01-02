
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mastering } from '../models/Mastering';
import { User } from '../models/User';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToClass } from 'class-transformer';

@Injectable({ providedIn: 'root' })
export class MasteringService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getAllById(id : number): Observable<Mastering[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/mastering/` + id)
            .pipe(map(res => plainToClass(Mastering, res))
        );
    }

    public delete(m: Mastering): Observable<boolean> {
        console.log("delete " + m.masteringId);
        return this.http.delete<boolean>(`${this.baseUrl}api/mastering/${m.masteringId}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }


    
}

