import { Component, ViewChild, Inject } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsingService } from '../../services/using.service';
import { SkillService } from '../../services/skills.service';
import { EnterpriseService } from '../../services/enterprise.service';
import { FormGroup, FormControl, ValidatorFn, AbstractControl, Validators, FormBuilder, ValidationErrors } from '@angular/forms';
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
import { ThrowStmt } from '@angular/compiler';


const startDateValidation: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const start = control.get('start') as FormControl;
    const finish = control.get('finish') as FormControl;
    if(finish.value === null){
        return null;
    }else{
        return (start.value !== null && finish.value !== null) && start.value < finish.value ? null :{ dateValid:true };
    }
}


@Component({
    selector : 'app-edit-training',
    templateUrl: './edit-training.component.html',
    styleUrls: ['./edit-training.component.css']
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
    public isProgress : boolean;
    public disableProgress : boolean;
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
        this.ctlFinish = this.fb.control('');
        this.ctlEnterprise = this.fb.control('');
        this.ctlTitle = this.fb.control('',Validators.required);
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
        this.disableProgress = (data.training.finish == null)? true : false;
        this.isProgress = (data.training.finish == null)? true : false;
        this.isNew = data.isNew;
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

    isInTheListLanguage(name : string) : boolean{
        for( const str in this.getLanguages){
            if(this.getLanguages[str].skill?.name == name){
                return true;
            }
        }
        return false;
    }


    addLanguage(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        var exist = this.isInTheListLanguage(value);
        if ((value || '').trim()) {
            if(!exist){
                this.langList.errorState = false;
                this.skillService.getByName(value).subscribe(res =>{
                    if(res != null){
                        if(res.categoryId ===  1){
                            this.usingService.AddUsing(this.idExperience,res).subscribe(res2 => {
                            this.frm.controls['languages'].value.push(res2);
                                if (!res2) {
                                    this.snackBar.open(`There was an error at the server. The member has not been created! Please try again.`, 'Dismiss', { duration: 10000 });
                                }
                            });
                        }else{
                            this.snackBar.open(`Skill is not a language !`, 'Dismiss', { duration: 10000 });
                        }
                        
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

        isInTheListDatabase(name : string) : boolean{
            for( const str in this.getDatabases){
                if(this.getDatabases[str].skill?.name == name){
                    return true;
                }
            }
            return false;
        }

    
      addDatabase(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        var exist = this.isInTheListDatabase(value);
        if ((value || '').trim()) {
            if(!exist){
                this.dataList.errorState = false;
                this.skillService.getByName(value).subscribe(res =>{
                    if(res != null){
                        if(res.categoryId ===  2){
                            this.usingService.AddUsing(this.idExperience,res).subscribe(res2 => {
                                this.frm.controls['databases'].value.push(res2);
                                if (!res2) {
                                    this.snackBar.open(`There was an error at the server. The member has not been created! Please try again.`, 'Dismiss', { duration: 10000 });
                                }
                            });
                        }else{
                            this.snackBar.open(`Skill is not a database`, 'Dismiss', { duration: 10000 });
                        } 
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

      isInTheListFramework(name : string) : boolean{
        for( const str in this.getFrameworks){
            if(this.getFrameworks[str].skill?.name == name){
                return true;
            }
        }
        return false;
    }

      addFramework(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        var exist = this.isInTheListFramework(value);
        if ((value || '').trim()) {
            if(!exist){
                this.frameList.errorState = false;
                this.skillService.getByName(value).subscribe(res =>{
                    if(res != null){
                        if(res.categoryId === 3){
                            this.usingService.AddUsing(this.idExperience,res).subscribe(res2 => {
                                this.frm.controls['frameworks'].value.push(res2);
                                if (!res2) {
                                    this.snackBar.open(`There was an error at the server. The member has not been created! Please try again.`, 'Dismiss', { duration: 10000 });
                                }
                            });
                        }else{
                            this.snackBar.open(`Skill is not a framework !`, 'Dismiss', { duration: 10000 });
                        }
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

    progressChange(checked : boolean){
        console.log("boolean : "+checked);
        if(checked){
            this.ctlFinish.setValue(null);
        }
        this.isProgress = checked;
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