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
        return this.http.get<any[]>(`${this.baseUrl}api/Users`)
            .pipe(map(res => plainToClass(User, res))
        );
    }

    getTeam(id : number): Observable<User[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/Users/team/` + id)
            .pipe(map(res => plainToClass(User, res))
        );
    }
    
    getById(id: number) {
        return this.http.get<User>(`${this.baseUrl}api/users/${id}`).pipe(
            map(m => plainToClass(User, m)),
            catchError(err => of(null))
        );
    }


    getByEmail(email: string) {
        return this.http.get<User>(`${this.baseUrl}api/Users/${email}`).pipe(
            map(m => plainToClass(User, m)),
            catchError(err => of(null))
        );
    }

    public unLink(m: User): Observable<boolean> {
        return this.http.put<User>(`${this.baseUrl}api/Users/unlink`, m).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
    public Link(m: User, id: number): Observable<boolean> {
        console.log(id);
        return this.http.put<User>(`${this.baseUrl}api/Users/link/${id}`, m).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public delete(m: User): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/Users/${m.userId}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    /*public unLink(u: User) : Observable<Boolean> {
        return this.http.put<Boolean>()
    }*/

    public add(m: User): Observable<boolean> {
        return this.http.post<User>(`${this.baseUrl}api/members`, m).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    signup( pseudo : string, firstName : string, lastName : string, email : string, birthDate : Date, title : string, password : string ) {
        return this.http.post<any>(`${this.baseUrl}api/users/`, {pseudo, firstName, lastName ,email, birthDate, title, password})
            .pipe(map(user => {
                console.log(user);
                return user;
            }));
    }



    public update(u: User): Observable<boolean> {
        console.log(u.email + " helllllllllllooooooooooo");
        return this.http.put<User>(`${this.baseUrl}api/users`, u).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public uploadPicture(email: string, file: File): Observable<string | undefined> {
        console.log(file);
        const formData = new FormData();
        formData.append('email', email);
        formData.append('picture', file);
        return this.http.post<string>(`${this.baseUrl}api/users/upload`, formData).pipe(
            catchError(err => {
                console.error(err);
                return of(undefined);
            })
        );
    }
    
    public confirmPicture(email: string, path?: string): Observable<string | undefined> {
        return this.http.post<string>(`${this.baseUrl}api/users/confirm`, { email: email, picturePath: path }).pipe(
            catchError(err => {
                console.error(err);
                return of(undefined);
            })
        );
    }
    
    public cancelPicture(path?: string): Observable<string | undefined> {
        return this.http.post<string>(`${this.baseUrl}api/users/cancel`, { picturePath: path }).pipe(
            catchError(err => {
                console.error(err);
                return of(undefined);
            })
        );
    }
    


    

  

    
}
