import { ParseErrorLevel } from "@angular/compiler";
import * as internal from "assert";
import { Transform, Type } from "class-transformer";
import * as moment from "moment";
import { Moment } from "moment";

import 'reflect-metadata';


export enum Role {
    Manager = 0,
    Consultant = 1
  }



  export class Mastering {

   masteringId?: number;
   level?: string;
   skill?: number;

  }



export class User {
    pseudo?: string;
    password?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    title?: string;
    @Type(() => Date)
    @Transform(({ value }) => value ? moment(value) : value, { toClassOnly: true })

    birthDate?: Moment;
    role?: Role;
    token?:string;
    masterings: Mastering[] = [];

    get display(): string {
        return `${this.pseudo} (${this.birthDate ? this.age + ' years old' : 'age unknown'})`;
    } 

    get age(): number | undefined {
        if (!this.birthDate)
            return undefined;
            var today = moment();
            return today.diff(this.birthDate, 'years');
    }

   /* constructor(data: any) {
        if (data) {
        
            this.pseudo = data.pseudo;
            this.password = data.password;
            this.firstname = data.firstname;
            this.lastname = data.lastname;
            this.email = data.email;
            this.title = data.title;
            this.birthDate = data.birthDate &&
                data.birthDate.length > 10 ? data.birthDate.substring(0, 10) : data.birthDate;
            this.token = data.token; 
            this.role = data.role;
            this.masterings = data.masterings;
            
        }
    } */

    
    /*public get roleAsString(): string {
        return Role[this.role];
    }*/




    
}