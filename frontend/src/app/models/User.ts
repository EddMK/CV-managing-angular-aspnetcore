import { ParseErrorLevel } from "@angular/compiler";
import * as internal from "assert";
import { Transform, Type } from "class-transformer";
import * as moment from "moment";
import { Moment } from "moment";
import { Mastering } from "./Mastering";

import 'reflect-metadata';




export enum Role {
    Manager = 0,
    Consultant = 1
  }


export class User {
    userId?: number;
    pseudo?: string;
    password?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    title?: string;
    @Type(() => Date)
    @Transform(({ value }) => value ? moment(value) : value, { toClassOnly: true })

    birthDate?: Moment;
    role?: string;
    token?:string;
    masterings: Mastering[] = [];
    manager?: User;

    get display(): string {
        return `${this.pseudo} (${this.birthDate ? this.age + ' years old' : 'age unknown'})`;
    } 

    get age(): number | undefined {
        if (!this.birthDate)
            return undefined;
            var today = moment();
            return today.diff(this.birthDate, 'years');
    }

 

    

  

   constructor(data: any) {
        if (data) {
            
            this.firstname = data.firstname;
            this.lastname = data.lastname;
            this.email = data.email;
            this.birthDate = data.birthDate;
            this.title = data.title;
            this.password = data.password;  
            this.manager = data.manager;     
        }
    } 

    
    




    
}