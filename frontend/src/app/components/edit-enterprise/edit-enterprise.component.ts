import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { EnterpriseService } from '../../services/enterprise.service';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import { Enterprise } from 'src/app/models/Enterprise';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
    selector: 'app-edit-enterprise-mat',
    templateUrl: './edit-enterprise.component.html',
    styleUrls: ['./edit-enterprise.component.css']
})
export class EditEnterpriseComponent {
    public frm!: FormGroup;
    public ctlName!: FormControl;
    public isNew: boolean;
    public id : any;

    constructor(public dialogRef: MatDialogRef<EditEnterpriseComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { enterprise: Enterprise; isNew: boolean; },
        private fb: FormBuilder,
        private enterpriseService: EnterpriseService
    ) {
        this.ctlName = this.fb.control('', [Validators.required, Validators.minLength(1)], [this.nameUsed()]);
        this.frm = this.fb.group({
            idEnterprise : this.id,
            name: this.ctlName,
        });
        this.isNew = data.isNew;
        this.frm.patchValue(data.enterprise);
        this.id = data.enterprise.idEnterprise;
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
                        this.enterpriseService.getByName(sk).subscribe(skill => {
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