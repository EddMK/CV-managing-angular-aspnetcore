import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { SkillService } from '../../services/skills.service';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Experience } from 'src/app/models/Experience';
import { Using } from 'src/app/models/Using';
import * as _ from 'lodash-es';
import { Skill } from 'src/app/models/Skill';
import { MatChipInputEvent } from "@angular/material/chips";
import { Moment } from 'moment';
import * as moment from 'moment';
import { Variable } from '@angular/compiler/src/render3/r3_ast';


@Component({
    selector : 'app-edit-training',
    templateUrl: './edit-training.component.html'
})
export class EditTrainingComponent{
    public frm!: FormGroup;
    public ctlStart!: FormControl;
    public ctlFinish!: FormControl;
    public ctlEnterprise! : FormControl;
    public ctlTitle! : FormControl;
    public ctlDescription! : FormControl;
    public ctlGrade! : FormControl;
    public ctlLanguages! : FormControl;
    public ctlDatabases! : FormControl;
    public ctlFrameworks! : FormControl;
    public isNew: boolean;
    public id : any;
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(public dialogRef: MatDialogRef<EditTrainingComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { training: Experience; isNew: boolean; },
        private fb: FormBuilder
        //private skillService: SkillService
    ) {
        var enterpriseName = data.training.enterprise?.name;
        this.ctlStart = this.fb.control('');
        this.ctlFinish = this.fb.control('');
        this.ctlEnterprise = this.fb.control('');
        this.ctlTitle = this.fb.control('');
        this.ctlDescription = this.fb.control('');
        this.ctlGrade = this.fb.control('');
        this.ctlLanguages = this.fb.control('');
        this.ctlDatabases = this.fb.control('');
        this.ctlFrameworks = this.fb.control('');
        this.frm = this.fb.group({
            start: this.ctlStart,
            finish : this.ctlFinish,
            enterprise : this.ctlEnterprise,
            title : this.ctlTitle,
            description : this.ctlDescription,
            grade : this.ctlGrade,
            languages : this.ctlLanguages,
            databases : this.ctlDatabases,
            frameworks : this.ctlFrameworks
        });
        this.isNew = data.isNew;
        this.distribution(data.training);
    }

    distribution(experience : Experience) : void{
        var language  = new Array() ;
        var database  = new Array() ;
        var framework  = new Array() ;
        const l : Using[] = experience.usings.filter(using => using.skill?.category?.name === "Language");
        l.forEach(using => language.push(using.skill?.name));
        //"Database"
        const d : Using[] = experience.usings.filter(using => using.skill?.category?.name === "Database");
        d.forEach(using => database.push(using.skill?.name));
        //Framework
        const f : Using[] = experience.usings.filter(using => using.skill?.category?.name === "Framework");
        f.forEach(using => framework.push(using.skill?.name));
        this.frm.patchValue({
            start: experience.start,
            finish : experience.finish,
            enterprise : experience.enterprise?.name,
            title : experience.title,
            description : experience.description,
            grade : experience.grade,
            languages : language,
            databases : database,
            frameworks : framework
        });
    }

    addLanguage(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if ((value || '').trim()) {
            this.frm.controls['languages'].value.push(value);
        }
        event.chipInput!.clear();
      }
    
      removeLanguage(language: String): void {
        const index = this.frm.controls['languages'].value.indexOf(language);
        if (index > -1) {
            this.frm.controls['languages'].value.splice(index, 1);
        }
      }

    
      addDatabase(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if ((value || '').trim()) {
            this.frm.controls['databases'].value.push(value);
        }
        event.chipInput!.clear();
      }
    
      removeDatabase(database: String): void {
        const index = this.frm.controls['databases'].value.indexOf(database);
        if (index > -1) {
            this.frm.controls['databases'].value.splice(index, 1);
        }
      }

      addFramework(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if ((value || '').trim()) {
            this.frm.controls['frameworks'].value.push(value);
        }
        event.chipInput!.clear();
      }
    
      removeFramework(framework: String): void {
        const index = this.frm.controls['frameworks'].value.indexOf(framework);
        if (index > -1) {
            this.frm.controls['frameworks'].value.splice(index, 1);
        }
      }
    
    // use getter method to access courseIds control value easily
    get getLanguages() {
        return this.frm.get('languages')?.value;
    }

    get getDatabases(){
        return this.frm.get('databases')?.value;
    }

    get getFrameworks(){
        return this.frm.get('frameworks')?.value;
    }


    onNoClick(): void {
        this.dialogRef.close();
    }

    update() {
        this.dialogRef.close(this.frm.value);
    }

    cancel() {
        this.dialogRef.close();
    }

}