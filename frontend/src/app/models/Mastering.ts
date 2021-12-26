

import { ParseErrorLevel } from "@angular/compiler";
import * as internal from "assert";
import { Transform, Type } from "class-transformer";
import * as moment from "moment";
import { Moment } from "moment";

import 'reflect-metadata';
import { Category } from "./Category";
import { Skill } from "./Skill";


export enum Level {
    Beginner = 1, Intermediate = 2, Advanced = 3
}


export class Mastering {

   masteringId?: number;
   userId?: number;
   skillId?: number;
   skill?: Skill;
   level?: Level;

   public get skilltoString(){
       return this.skill?.name;
   }
   public get categoryToString(){
       return this.skill?.category?.name;
   }

 

}