import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    loading = false;    
    submitted = false; 
    returnUrl!: string;
    ctlEmail!: FormControl;
    ctlPassword!: FormControl;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        if (this.authenticationService.currentUser) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
         this.ctlEmail = this.formBuilder.control('', Validators.required);
         this.ctlPassword = this.formBuilder.control('', Validators.required);

        this.loginForm = this.formBuilder.group({
            email: this.ctlEmail,
            password: this.ctlPassword
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }


    get f() { return this.loginForm.controls; }

  
    onSubmit() {
        this.submitted = true;

        // on s'arrête si le formulaire n'est pas valide
        if (this.loginForm.invalid) return;

        this.loading = true;
        this.authenticationService.login(this.f.email.value, this.f.password.value).subscribe(
                // si login est ok, on navigue vers la page demandée
                data => {
                    console.log("return url : "+this.returnUrl);
                    this.router.navigate([this.returnUrl]);
                },
                // en cas d'erreurs, on reste sur la page et on les affiche
                error => {
                    const errors = error.error.errors;
                    for (let field in errors) {
                        this.loginForm.get(field.toLowerCase())?.setErrors({ custom: errors[field] })
                    }
                    this.loading = false;
                }
        );
    }
}
