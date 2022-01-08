import { Component, ViewChild } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { UsingService } from '../../services/using.service';
import { SkillService } from '../../services/skills.service';
import { EnterpriseService } from '../../services/enterprise.service';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { ValidationErrors } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Experience } from 'src/app/models/Experience';
import { Using } from 'src/app/models/Using';
import * as _ from 'lodash-es';
import { Skill } from 'src/app/models/Skill';
import { Enterprise } from 'src/app/models/Enterprise';
import { MatChipInputEvent } from "@angular/material/chips";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipList } from "@angular/material/chips";
import { Moment } from 'moment';
import * as moment from 'moment';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';


const startDateValidation: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const start = control.get('start') as FormControl;
    const finish = control.get('finish') as FormControl;
    return start.value !== null && finish.value !== null && start.value < finish.value ? null :{ dateValid:true };
  }


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
    public idExperience : any;
    public isTraining : boolean;
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    listEnterprises : Enterprise[] = [];
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    @ViewChild("langList") langList :  any;
    @ViewChild("dataList") dataList :  any;
    @ViewChild("frameList") frameList :  any;

    constructor(public dialogRef: MatDialogRef<EditTrainingComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { training: Experience; isNew: boolean, isMission : boolean},
        private fb: FormBuilder,
        private usingService: UsingService,
        private skillService : SkillService,
        private enterpriseService : EnterpriseService,
        public snackBar: MatSnackBar
    ) {
        this.ctlStart = this.fb.control('', Validators.required);
        this.ctlFinish = this.fb.control('', Validators.required);
        this.ctlEnterprise = this.fb.control({value : 'CACA'});
        this.ctlTitle = this.fb.control('');
        this.ctlDescription = this.fb.control('');
        this.ctlGrade = this.fb.control('', [Validators.min(0),Validators.max(100)]);
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
        }, { validators : startDateValidation });
        if(!data.isNew){
            if(data.training?.role?.toString() === "TRAINING"){
                this.isTraining = true;
            }else{
                this.isTraining = false;
            }
        }else{
            if(data.isMission){
                this.isTraining = false;
            }else{
                this.isTraining = true;
            }
        }
        
        console.log("BOOLEAN IS TRAINING : "+this.isTraining);
        this.isNew = data.isNew;
        console.log(data.training);
        this.idExperience = data.training.idExperience!;
        this.distribution(data.training);
        this.enterpriseService.getAll().subscribe( enterprises =>{
            this.listEnterprises = enterprises;
        });
    } 

      displayFn(e: Enterprise): string {
        return e && e.name ? e.name : '';
      }
    

    setError() {
        this.langList.errorState = true;
    }

    distribution(experience : Experience) : void{
        var language  = new Array() ;
        var database  = new Array() ;
        var framework  = new Array() ;
        const l : Using[] = experience.usings.filter(using => using.skill?.category?.name === "Language");
        language = l;
        //"Database"
        const d : Using[] = experience.usings.filter(using => using.skill?.category?.name === "Database");
        database = d;
        //Framework
        const f : Using[] = experience.usings.filter(using => using.skill?.category?.name === "Framework");
        framework = f;
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
        var exist = this.frm.controls['languages'].value.includes(value);
        if ((value || '').trim()) {
            if(!exist){
                this.langList.errorState = false;
                console.log(value);
                this.skillService.getByName(value).subscribe(res =>{
                    console.log(res);
                    if(res != null){
                        this.usingService.AddUsing(this.idExperience,res).subscribe(res2 => {
                            console.log(res2);
                            this.frm.controls['languages'].value.push(res2);
                            if (!res2) {
                                this.snackBar.open(`There was an error at the server. The member has not been created! Please try again.`, 'Dismiss', { duration: 10000 });
                            }
                        });
                    }else{
                        this.snackBar.open(`Skill does not exist in database !`, 'Dismiss', { duration: 10000 });
                    }
                });
            }else{
                this.langList.errorState = true;
            }
        }
        event.chipInput!.clear();
      }
    
    
      removeLanguage(language: Using): void {
        const index = this.frm.controls['languages'].value.indexOf(language);
        const idSkill = language.skill?.skillId;
        if (index > -1) {
            this.frm.controls['languages'].value.splice(index, 1);  
            this.usingService.DeleteUsing(this.idExperience,idSkill).subscribe(); 
        }
      }

    
      addDatabase(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        var exist = this.frm.controls['databases'].value.includes(value);
        if ((value || '').trim()) {
            if(!exist){
                this.dataList.errorState = false;
                this.skillService.getByName(value).subscribe(res =>{
                    console.log(res);
                    if(res != null){
                        this.usingService.AddUsing(this.idExperience,res).subscribe(res2 => {
                             console.log(res2);
                            this.frm.controls['databases'].value.push(res2);
                            if (!res2) {
                                this.snackBar.open(`There was an error at the server. The member has not been created! Please try again.`, 'Dismiss', { duration: 10000 });
                            }
                        }); 
                    }else{
                        this.snackBar.open(`Skill does not exist in database !`, 'Dismiss', { duration: 10000 });
                    }
                });
            }else{
                this.dataList.errorState = true;
            }
        }
        event.chipInput!.clear();
      }
    
      removeDatabase(database: Using): void {
        const index = this.frm.controls['databases'].value.indexOf(database);
        const idSkill = database.skill?.skillId;
        if (index > -1) {
            this.frm.controls['databases'].value.splice(index, 1);  
            this.usingService.DeleteUsing(this.idExperience,idSkill).subscribe(); 
        }
      }

      addFramework(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        var exist = this.frm.controls['frameworks'].value.includes(value);
        if ((value || '').trim()) {
            if(!exist){
                this.frameList.errorState = false;
                this.skillService.getByName(value).subscribe(res =>{
                    console.log(res);
                    if(res != null){
                        this.usingService.AddUsing(this.idExperience,res).subscribe(res2 => {
                             console.log(res2);
                            this.frm.controls['frameworks'].value.push(res2);
                            if (!res2) {
                                this.snackBar.open(`There was an error at the server. The member has not been created! Please try again.`, 'Dismiss', { duration: 10000 });
                            }
                        }); 
                    }else{
                        this.snackBar.open(`Skill does not exist in database !`, 'Dismiss', { duration: 10000 });
                    }
                });
            }else{
                this.frameList.errorState = true;
            }
        }
        event.chipInput!.clear();
      }
               
    
      removeFramework(framework: Using): void {
        const index = this.frm.controls['frameworks'].value.indexOf(framework);
        const idSkill = framework.skill?.skillId;
        if (index > -1) {
            this.frm.controls['frameworks'].value.splice(index, 1);  
            this.usingService.DeleteUsing(this.idExperience,idSkill).subscribe(); 
        }
      }
    
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