import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { SkillService } from '../../services/skills.service';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import { Skill } from 'src/app/models/Skill';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
    selector: 'app-edit-skill-mat',
    templateUrl: './edit-skill.component.html',
    styleUrls: ['./edit-skill.component.css']
})
export class EditSkillComponent {
    public frm!: FormGroup;
    public ctlName!: FormControl;
    public ctlCategory!: FormControl;
    public isNew: boolean;
    public id : any;

    constructor(public dialogRef: MatDialogRef<EditSkillComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { skill: Skill; isNew: boolean; },
        private fb: FormBuilder,
        private skillService: SkillService
    ) {
        this.ctlName = this.fb.control('', [Validators.required, Validators.minLength(1)], [this.nameUsed()]);
        this.ctlCategory = this.fb.control('', Validators.required);
        this.frm = this.fb.group({
            skillId : this.id,
            name: this.ctlName,
            categoryId: this.ctlCategory
        });
        this.isNew = data.isNew;
        this.frm.patchValue(data.skill);
        this.id = data.skill.skillId;
    }

    nameUsed(): any {
        let timeout: NodeJS.Timer;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            const sk = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    if (ctl.pristine) {
                        resolve(null);
                    } else {
                        this.skillService.getByName(sk).subscribe(skill => {
                            resolve(skill ? { nameUsed: true } : null);
                        });
                    }
                }, 300);
            });
        };
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
