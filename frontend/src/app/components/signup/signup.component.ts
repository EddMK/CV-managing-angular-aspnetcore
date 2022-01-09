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
    loading = false;    // utilisé en HTML pour désactiver le bouton pendant la requête de login
    submitted = false;  // retient si le formulaire a été soumis ; utilisé pour n'afficher les 
    // erreurs que dans ce cas-là (voir template)
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
        // redirect to home if already logged in
        if (this.authenticationService.currentUser) {
            this.router.navigate(['/']);
        }
        const moment = require('moment');
        this.maxDate = moment(new Date());
    }

    ngOnInit() {

        this.ctlLastName = this.formBuilder.control('', Validators.required);
        this.ctlFirstName = this.formBuilder.control('', Validators.required);
        this.ctlEmail = this.formBuilder.control('', [Validators.required, Validators.email], [this.emailUsed()]);
        this.ctlBirthday = this.formBuilder.control('', [Validators.required], [this.dateValid()]);
        this.ctlTitle = this.formBuilder.control('', Validators.required);
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

        // get return url from route parameters or default to '/'
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

    dateValid(): any {
        let timeout: NodeJS.Timer;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            const date = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    console.log("date signup : "+ date);
                    if (ctl.pristine) {
                        resolve(null);
                    } else {
                        /*
                        this.userService.getByEmail(mail).subscribe(user => {
                            resolve(user ? { emailUsed: true } : null);
                        });*/
                    }
                }, 300);
            });
        };
    }


    /**
     * Cette méthode est bindée sur l'événement onsubmit du formulaire. On va y faire le
     * login en faisant appel à AuthenticationService.
     */
     onSubmit() {
        this.submitted = true;

        // on s'arrête si le formulaire n'est pas valide
        if (this.signupForm.invalid) return;
        
        this.loading = true;

        //console.log(user);
        const user = new User(this.signupForm.value);
        console.log(user);
        
        this.userService.signup(user).subscribe(
                // si signup est ok, on navigue vers la page demandée
                data => {
                    this.authenticationService.login(user.email!, user.password!).subscribe(
                        // si login est ok, on navigue vers la page demandée
                        data => {
                            console.log("return url : "+this.returnUrl);
                            this.router.navigate([this.returnUrl]);
                        },
                        // en cas d'erreurs, on reste sur la page et on les affiche
                        error => {
                            this.loading = false;
                        }
                );
                },
                // en cas d'erreurs, on reste sur la page et on les affiche
                error => {
                    console.log(error.error.errors);
                }
        );
    }
}