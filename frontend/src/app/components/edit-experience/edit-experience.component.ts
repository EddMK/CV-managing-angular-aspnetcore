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
    if(finish.value === null || finish.value === undefined || finish.value == ''){
        return null;
    }else{
        return (start.value !== null && finish.value !== null) && start.value < finish.value ? null :{ dateValid:true };
    }
}


@Component({
    selector : 'app-edit-experience',
    templateUrl: './edit-experience.component.html',
    styleUrls: ['./edit-experience.component.css']
})
export class EditExperienceComponent{
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

    constructor(public dialogRef: MatDialogRef<EditExperienceComponent>,
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
            Languages : this.ctlLanguages,
            Databases : this.ctlDatabases,
            Frameworks : this.ctlFrameworks
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
            Languages : language,
            Databases : database,
            Frameworks : framework
        });
    }

    setError(category : string, state : boolean) : number {
        switch (category) {
            case "Languages":
                this.langList.errorState = state;
                return 1;
            case "Databases":
                this.dataList.errorState = state;
                return 2;
            case "Frameworks":
                this.frameList.errorState = state;
                return 3;
        }
        return 0;
    }

    addSkill(event: MatChipInputEvent, category : string): void {
        const value = (event.value || '').trim();
        var exist = this.isInTheList(value, category);
        if ((value || '').trim()) {
            if(!exist){
                var numerId = this.setError(category, false);
                console.log("numer Id : "+numerId+"  "+category);
                this.skillService.getByName(value).subscribe(res =>{
                    if(res != null){
                        if(res.categoryId ===  numerId){
                            this.usingService.AddUsing(this.idExperience,res).subscribe(res2 => {
                            this.frm.controls[category].value.push(res2);
                                if (!res2) {
                                    this.snackBar.open(`There was an error at the server. The member has not been created! Please try again.`, 'Dismiss', { duration: 10000 });
                                }
                            });
                        }else{
                            this.snackBar.open(`Skill is not in this category !`, 'Dismiss', { duration: 10000 });
                        }
                    }else{
                        this.snackBar.open(`Skill does not exist in database !`, 'Dismiss', { duration: 10000 });
                    }
                });
            }else{
                this.setError(category, true);
            }
        }
        event.chipInput!.clear();
    }
        
    isInTheList(name : string, category : string) : boolean{
        for( const str in this.getSkills(category)){
            if(this.getSkills(category)[str].skill?.name == name){
                return true;
            }
        }
        return false;
    }

    removeUsing(using : Using, category : string) : void{
        const index = this.frm.controls[category].value.indexOf(using);
        const idSkill = using.skill?.skillId;
        if (index > -1) {
            this.frm.controls[category].value.splice(index, 1);  
            this.usingService.DeleteUsing(this.idExperience,idSkill).subscribe(); 
        }
    }
    
      getSkills(category : string): any{
        return this.frm.get(category)?.value;
      }
    
    get getLanguages() {
        return this.frm.get('Languages')?.value;
    }

    get getDatabases(){
        return this.frm.get('Databases')?.value;
    }

    get getFrameworks(){
        return this.frm.get('Frameworks')?.value;
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