
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
            .pipe(map(res => plainToClass(Experience, res))
        );
    }
    GetAllMissionById(id : number): Observable<Experience[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/experiences/getMissionById/` + id)
            .pipe(map(res => plainToClass(Experience, res))
        );
    }

    
}
