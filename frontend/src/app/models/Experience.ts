import { ParseErrorLevel } from "@angular/compiler";
import * as internal from "assert";
import { Transform, Type } from "class-transformer";
import * as moment from "moment";
import { Moment } from "moment";
import { Enterprise } from "./Enterprise";
import { Using } from "./Using";

import 'reflect-metadata';




export enum RoleExperience {
   Training = 0,
   Mission = 1
  }

export class Experience {

    idExperience?: number;
    userId?: string;
    @Type(() => Date)
    @Transform(({ value }) => value ? moment(value) : value, { toClassOnly: true })
    start?: Moment;
    @Type(() => Date)
    @Transform(({ value }) => value ? moment(value) : value, { toClassOnly: true })
    finish?: Moment;
    title?: string;
    description?: string;
    role?: RoleExperience;
    enterprise?: Enterprise;
    grade?: number;
    usings: Using[] = [];


    public get enterpriseToString(){
      return this.enterprise?.name;
  }

}

