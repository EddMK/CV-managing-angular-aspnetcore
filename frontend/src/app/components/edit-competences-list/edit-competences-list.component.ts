import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import { User,  Role } from 'src/app/models/User';

import { Moment } from 'moment';
import * as moment from 'moment';
import { Level, Mastering } from 'src/app/models/Mastering';
import { MasteringService } from 'src/app/services/mastering.service';
import { UsingService } from 'src/app/services/using.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkillService } from 'src/app/services/skills.service';
import { Skill } from 'src/app/models/Skill';
import { Using } from 'src/app/models/Using';
import { plainToClass } from 'class-transformer';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    selector: 'app-edit-competenceslis-mat',
    templateUrl: './edit-competences-list.component.html',
   
})
export class EditCompetencesListComponent {
    public frm!: FormGroup;
    public ctlSkillId!: FormControl;
    public ctlCategoryName!: FormControl;
    public ctlLevel!: FormControl;
    public isNew: boolean;
    public masterings: Mastering[];
    
    public skills! : Skill[];
    selectedValue!: Skill;

    connectedUser : User | undefined;

    constructor(public dialogRef: MatDialogRef<EditCompetencesListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { masterings: Mastering[];isNew: boolean; },
        private fb: FormBuilder,
        private masteringService: MasteringService,
        private skillService: SkillService,
        private authService: AuthenticationService
        
    ) {
        this.connectedUser = this.currentUser;
        this.ctlSkillId = this.fb.control(null, Validators.required,[this.MasteringUsed()]);
        this.ctlCategoryName = this.fb.control(null, []);
        this.ctlLevel = this.fb.control(null, []);
        this.skillService.getAll().subscribe(res => {
            this.skills = res;
        });
        this.frm = this.fb.group({
            skill: this.ctlSkillId,
            level: this.ctlLevel,
        });
        this.isNew = data.isNew;
        this.masterings = data.masterings;  
        this.frm.patchValue(data.masterings);
    }
   
    get currentUser()  {
        return this.authService.currentUser;
    }

    isSkillInMastering(skill : Skill){
        for(let m of this.masterings){
            if(m?.skillId! == skill?.skillId!)
               return true;
        }
        return false;
    }

    MasteringUsed(): any {
        let timeout: NodeJS.Timer;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            const skill = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                        this.isSkillInMastering(skill);
                        resolve(this.isSkillInMastering(skill) ? {MasteringUsed: true } : null);
                }, 300);
            });
        };
    }

    forbiddenValue(val: string): any {
        return (ctl: FormControl) => {
            if (ctl.value === val) {
                return { forbiddenValue: { currentValue: ctl.value, forbiddenValue: val } };
            }
            return null;
        };
    }

     refresh(id: number) {
        this.masteringService.getAllById(id).subscribe(m => {
            this.masterings = m;
        });
    }

    create(form : any){
              var skill = plainToClass(Skill, form.value.skill);
               this.masteringService.add(skill, this.connectedUser?.userId, form.value.level).subscribe(m => {
                   this.refresh(this.connectedUser?.userId!);
              });
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
