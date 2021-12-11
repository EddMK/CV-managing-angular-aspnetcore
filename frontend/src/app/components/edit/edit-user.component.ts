import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import { User,  Mastering, Role } from 'src/app/models/User';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
    selector: 'app-edit-user-mat',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
    public frm!: FormGroup;
    public frmMastering!: FormGroup; 
    public ctlFirstname!: FormControl;
    public ctlLastname!: FormControl;
    public ctlEmail!: FormControl;
    public ctlPassword!: FormControl;
    public ctlRole!: FormControl;
    public isNew: boolean;
    public maxDate: Moment = moment().subtract(18, 'years');
    public mastering!: Mastering[];

    constructor(public dialogRef: MatDialogRef<EditUserComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { user: User; isNew: boolean; },
        private fb: FormBuilder,
        private userService: UserService
    ) {
        this.ctlEmail = this.fb.control('', [
            Validators.required,
            Validators.minLength(7),
        ], [this.EmailUsed()]);
        this.ctlPassword = this.fb.control('', data.isNew ? [Validators.required, Validators.minLength(3)] : []);
        this.ctlFirstname = this.fb.control(null, [Validators.minLength(3)]);
        this.ctlLastname = this.fb.control(null, [Validators.minLength(3)]);
        this.ctlRole = this.fb.control(Role.Consultant, []);
        this.frm = this.fb.group({
            password: this.ctlPassword,
            firstName: this.ctlFirstname,
            lastName: this.ctlLastname,
            role: this.ctlRole
        });

        this.isNew = data.isNew;
        this.frm.patchValue(data.user);
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
    EmailUsed(): any {
        let timeout: NodeJS.Timer;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            const email = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    if (ctl.pristine) {
                        resolve(null);
                    } else {
                        this.userService.getByEmail(email).subscribe(user => {
                            resolve(user ? { emailused: true } : null);
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
