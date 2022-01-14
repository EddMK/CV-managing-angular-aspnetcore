import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Skill } from '../models/Skill';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { Category } from '../models/Category';
import { Mastering } from '../models/Mastering';
import { Using } from '../models/Using';

@Injectable({ providedIn: 'root' })
export class SkillService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getAll(): Observable<Skill[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/Skills/`)
            .pipe(map(res => plainToClass(Skill, res))
        );
    }



    getCategory(skill: Skill) {
        return this.http.get<Category>(`${this.baseUrl}api/skills/getCategory/${skill}`).pipe(
            map(m => plainToClass( Category, m)),
            catchError(err => of(null))
        );
    }


    getByName(name: String) {
        return this.http.get<Skill>(`${this.baseUrl}api/skills/${name}`).pipe(
            map(m => plainToClass(Skill, m)),
            catchError(err => of(null))
        );
    }

    public update(s : Skill): Observable<boolean> {
        return this.http.put<Skill>(`${this.baseUrl}api/skills`, s).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public delete(s: Skill): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/skills/${s.skillId}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public add(s: Skill): Observable<boolean> {
        return this.http.post<Skill>(`${this.baseUrl}api/skills`, s).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
}