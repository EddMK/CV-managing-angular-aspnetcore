import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { Moment } from 'moment';

const passwordsValidations: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password') as FormControl;
    const confirm = control.get('confirmPassword') as FormControl;
    if(confirm.value === ""){
        return null;
    }
    return (confirm.value !== null && password.value !== null) && password.value === confirm.value ? null :{ passwordValid:true };
}


@Component({
    templateUrl: 'signup.component.html',
    styleUrls: ['signup.component.css']
})
export class SignupComponent  implements OnInit{
    signupForm!: FormGroup;
    loading = false;   
    submitted = false; 
    returnUrl!: string;
    ctlLastName!: FormControl;
    ctlFirstName!: FormControl;
    ctlEmail!: FormControl;
    ctlBirthday! : FormControl;
    ctlTitle! : FormControl;
    ctlPassword!: FormControl;
    ctlConfirmPassword!: FormControl;
    user! : User;
    maxDate: Moment;

    constructor(
        private userService: UserService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        if (this.authenticationService.currentUser) {
            this.router.navigate(['/']);
        }
        const moment = require('moment');
        this.maxDate = moment(new Date());
    }

    ngOnInit() {

        this.ctlLastName = this.formBuilder.control('', [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
        this.ctlFirstName = this.formBuilder.control('', [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
        this.ctlEmail = this.formBuilder.control('', [Validators.required, Validators.email], [this.emailUsed()]);
        this.ctlBirthday = this.formBuilder.control('', [Validators.required]);
        this.ctlTitle = this.formBuilder.control('', [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);///[^a-zA-Z0-9 ]/
        this.ctlPassword = this.formBuilder.control('', Validators.required);
        this.ctlConfirmPassword = this.formBuilder.control('', Validators.required);
        const moment = require('moment');
        this.maxDate = moment().subtract(18, 'years');

        this.signupForm = this.formBuilder.group({
            lastname: this.ctlLastName,
            firstname: this.ctlFirstName,
            email: this.ctlEmail,
            birthDate: this.ctlBirthday,
            title: this.ctlTitle,
            password: this.ctlPassword,
            confirmPassword : this.ctlConfirmPassword
        }, { validators : passwordsValidations });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    get f() { return this.signupForm.controls; }

    emailUsed(): any {
        let timeout: NodeJS.Timer;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            const mail = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    if (ctl.pristine) {
                        resolve(null);
                    } else {
                        this.userService.getByEmail(mail).subscribe(user => {
                            resolve(user ? { emailUsed: true } : null);
                        });
                    }
                }, 300);
            });
        };
    }
 
     onSubmit() {
        this.submitted = true;
        if (this.signupForm.invalid) return;
        this.loading = true;
        const user = new User(this.signupForm.value);
        this.userService.signup(user).subscribe(
                data => {
                    this.authenticationService.login(user.email!, user.password!).subscribe(
                        data => {
                            this.router.navigate([this.returnUrl]);
                        },
                        error => {
                            this.loading = false;
                        }
                    );
                },
                error => {
                    console.error(error.error.errors);
                }
        );
    }
}