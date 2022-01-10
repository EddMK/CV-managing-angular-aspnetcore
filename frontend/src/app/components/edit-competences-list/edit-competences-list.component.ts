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

@Component({
    selector: 'app-edit-competenceslis-mat',
    templateUrl: './edit-competences-list.component.html',
   
})
export class EditCompetencesListComponent {
    public frm!: FormGroup;
    public ctlSkill!: FormControl;
    public ctlCategory!: FormControl;
    public ctlLevel!: FormControl;
    public isNew: boolean;
    public masterings: Mastering[];


  

    constructor(public dialogRef: MatDialogRef<EditCompetencesListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { masterings: Mastering[];isNew: boolean; },
        private fb: FormBuilder,
        private masteringService: MasteringService,
        
    ) {
        
        this.ctlSkill = this.fb.control(null, [Validators.minLength(3)]);
        this.ctlCategory = this.fb.control(null, [Validators.minLength(3)]);
        this.ctlLevel = this.fb.control(Level.Advanced, []);
       
        this.frm = this.fb.group({
            skill: this.ctlSkill,
            level: this.ctlLevel,
            
        });
        this.isNew = data.isNew;
        this.masterings = data.masterings;
     
       
        this.frm.patchValue(data.masterings);
    }

    // Validateur bidon qui vérifie que la valeur est différente
    forbiddenValue(val: string): any {
        return (ctl: FormControl) => {
            if (ctl.value === val) {
                return { forbiddenValue: { currentValue: ctl.value, forbiddenValue: val } };
            }
            return null;
        };
    }

   

    create(){
      
    }

     refresh(id: number) {
        this.masteringService.getAllById(id).subscribe(m => {
            console.log(m);
            this.masterings = m;
        });
        
    }

    handleChildEvent () {
        // do what you need here
        console.log("parent refreshed");
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
