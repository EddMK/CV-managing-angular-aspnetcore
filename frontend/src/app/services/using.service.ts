
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mastering } from '../models/Mastering';
import { User } from '../models/User';
import { catchError, map } from 'rxjs/operators';
import { Observable, of , BehaviorSubject} from 'rxjs';
import { plainToClass } from 'class-transformer';
import { Experience } from '../models/Experience';
import { Using } from '../models/Using';
import { Skill } from '../models/Skill';
import { not } from '@angular/compiler/src/output/output_ast';


@Injectable({ providedIn: 'root' })
export class UsingService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }
    private usingToSend = new BehaviorSubject<Boolean>(false);
    public using$ = this.usingToSend.asObservable();

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

    GetUsingById(id : number): Observable<Using[]>{
        return this.http.get<any[]>(`${this.baseUrl}api/using/` + id)
        .pipe(map(res => plainToClass(Using, res))
       );
    }


    public AddUsing(idExperience : number, s: Skill){
        console.log(s.name);
        console.log(idExperience);
        return this.http.post<Skill>(`${this.baseUrl}api/using/addUsing/${idExperience}`,s)
        .pipe(map(res => 
                {console.log(res);
                    return res;
                }));
            /*
            catchError(err => {
                console.error(err);
                return of(false);
            })
            */
        
    }


    public DeleteUsing(idExperience : number, idSkill: any): Observable<boolean> {
        console.log("skill : "+idSkill);
        return this.http.delete<boolean>(`${this.baseUrl}api/using/${idExperience}/${idSkill}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }    
}