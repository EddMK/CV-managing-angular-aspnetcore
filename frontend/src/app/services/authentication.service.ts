import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../models/User';
import { plainToClass } from 'class-transformer';
import * as moment from 'moment';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    // l'utilisateur couramment connecté (undefined sinon)
    public currentUser?: User;
    

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
        let data = sessionStorage.getItem('currentUser');
        if (data)
            data = JSON.parse(data);
        this.currentUser = plainToClass(User, data);
        
        
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${this.baseUrl}api/users/authenticate`, { email, password })
            .pipe(map(user => {
                user = plainToClass(User, user);
                if (user && user.token) {
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUser = user;
                }
                return user;
            }));
    }

    logout() {
        sessionStorage.removeItem('currentUser');
        this.currentUser = undefined;
    }
}
