
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Level, Mastering } from '../models/Mastering';
import { User } from '../models/User';
import { Skill } from '../models/Skill';
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

    getAllBySkillid(id : number): Observable<Mastering[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/mastering/byskillid/${id}`)
            .pipe(map(res => plainToClass(Mastering, res))
        );
    }

    public delete(m: Mastering): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/mastering/${m.masteringId}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
    public save(m: Mastering, selectedLevel : number): Observable<boolean> {
        return this.http.put<Mastering>(`${this.baseUrl}api/mastering/${m.masteringId}`, selectedLevel).pipe( /// a problem happened here
            map(res => true), 
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
       
    }

    public add(s: Skill, userid : any, level : number): Observable<boolean> {
        console.log(s);
        console.log(userid);
        console.log(level);
        return this.http.post<Skill>(`${this.baseUrl}api/mastering/${userid}/${level}`,s).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public changeLevel(masteringId : number, level : number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/mastering/changeLevel/${masteringId}/${level}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }


    
}

