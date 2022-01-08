

import { ParseErrorLevel } from "@angular/compiler";
import * as internal from "assert";
import { Transform, Type } from "class-transformer";
import * as moment from "moment";
import { Moment } from "moment";

import 'reflect-metadata';
import { Category } from "./Category";
import { Skill } from "./Skill";


export enum Level {
    Beginner = 0, Intermediate = 1, Advanced = 2, Expert=3
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

   public set changeLevel(level : number) {
       this.level = level;
   }

   public get levelValue(){
       if(this.level?.toString() === "Beginner"){
           return 0;
       }
       else if(this.level?.toString() == "Intermediate"){
           return 1;
       }
       else {
           return 2;
       }
   }

 

}