
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mastering } from '../models/Mastering';
import { User } from '../models/User';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { Experience } from '../models/Experience';
import { Using } from '../models/Using';


@Injectable({ providedIn: 'root' })
export class UsingService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    GetLanguagesById(id : number): Observable<Using[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/using/languages/` + id)
            .pipe(map(res => plainToClass(Using, res))
        );
    }

    GetDatabasesById(id : number): Observable<Using[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/using/databases/` + id)
            .pipe(map(res => plainToClass(Using, res))
        );
    }

    GetFrameworksById(id : number): Observable<Using[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/using/frameworks/` + id)
            .pipe(map(res => plainToClass(Using, res))
        );
    }


    
    

    
}