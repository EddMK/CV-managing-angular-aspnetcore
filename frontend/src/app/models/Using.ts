import { ParseErrorLevel } from "@angular/compiler";
import * as internal from "assert";
import { Transform, Type } from "class-transformer";
import * as moment from "moment";
import { Moment } from "moment";
import { Experience } from "./Experience";

import 'reflect-metadata';
import { ExperienceService } from "../services/experience.service";
import { Skill } from "./Skill";



export class Using {


        Id?: number;

        ExperienceId?: number;

        //Experience?: Experience; 

        SkillId?: number;

        Skill?: Skill;

        public get usingToString(){
                return this.Skill?.name;
        }
}