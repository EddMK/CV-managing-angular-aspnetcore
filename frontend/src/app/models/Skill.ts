import { ParseErrorLevel } from "@angular/compiler";
import * as internal from "assert";
import { Transform, Type } from "class-transformer";
import * as moment from "moment";
import { Moment } from "moment";

import 'reflect-metadata';
import { Category } from "./Category";



export class Skill {


    skillId?: number;
    name?: String;
    categoryId?: number;
    category?: Category;

}