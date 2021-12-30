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
import { Mastering } from 'src/app/models/Mastering';
import { MasteringService } from 'src/app/services/mastering.service';

@Component({
    selector: 'app-edit-competences-mat',
    templateUrl: './edit-competences.component.html',
   
})
export class EditCompetencesComponent {
    public frm!: FormGroup;
    public ctlSkill!: FormControl;
    public ctlCategory!: FormControl;
    public ctlLevel!: FormControl;
    public isNew: boolean;
    public masterings: Mastering[];

   

    constructor(public dialogRef: MatDialogRef<EditCompetencesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mastering: Mastering[]; isNew: boolean; },
        private fb: FormBuilder,
        private masteringService: MasteringService
    ) {
        
        this.ctlSkill = this.fb.control(null, [Validators.minLength(3)]);
        this.ctlCategory = this.fb.control(null, [Validators.minLength(3)]);
        this.ctlLevel = this.fb.control(null, [Validators.minLength(3)]);

        
        this.frm = this.fb.group({
            skill: this.ctlSkill,
            level: this.ctlLevel,
            
        });

        this.isNew = data.isNew;
        this.masterings = data.mastering;
        this.frm.patchValue(data.mastering);
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

  

    // Validateur asynchrone qui vérifie si le pseudo n'est pas déjà utilisé par un autre membre

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
