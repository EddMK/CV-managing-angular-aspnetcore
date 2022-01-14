
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mastering } from '../models/Mastering';
import { User } from '../models/User';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { Experience } from '../models/Experience';


@Injectable({ providedIn: 'root' })
export class ExperienceService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    GetAllTraingById(id : number): Observable<Experience[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/experiences/getTrainingById/` + id)
            .pipe(map(res =>  plainToClass(Experience, res)));
    }
    GetAllMissionById(id : number): Observable<Experience[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/experiences/getMissionById/` + id)
            .pipe(map(res => plainToClass(Experience, res))
        );
    }

    public updateTraining(e : Experience): Observable<boolean> {
        console.log(e);
        return this.http.put<Experience>(`${this.baseUrl}api/experiences`, e).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
 
    public updateMission(e : Experience): Observable<boolean> {
        console.log(e);
        return this.http.put<Experience>(`${this.baseUrl}api/experiences/updateMission`, e).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public addTraining(e : Experience){
        console.log(e);
        return this.http.post<number>(`${this.baseUrl}api/experiences`, e)
        .pipe(map(res => 
            {console.log(res);
                return res;
            }));
    }

    public addMission(e : Experience){
        console.log(e);
        return this.http.post<number>(`${this.baseUrl}api/experiences/addMission`, e)
        .pipe(map(res => 
            {console.log(res);
                return res;
            }));
    }

    public deleteExperience(e : Experience): Observable<boolean> {
        console.log("Id delete  : "+e.idExperience);
        return this.http.delete<boolean>(`${this.baseUrl}api/experiences/${e.idExperience}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
    
}

