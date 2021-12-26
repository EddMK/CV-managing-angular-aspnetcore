import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';


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
    ctlPseudo! : FormControl;

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
    }

    ngOnInit() {

        this.ctlLastName = this.formBuilder.control('', Validators.required);
        this.ctlFirstName = this.formBuilder.control('', Validators.required);
        this.ctlEmail = this.formBuilder.control('', Validators.required);
        this.ctlBirthday = this.formBuilder.control('', Validators.required);
        this.ctlTitle = this.formBuilder.control('', Validators.required);
        this.ctlPassword = this.formBuilder.control('', Validators.required);
        this.ctlConfirmPassword = this.formBuilder.control('', Validators.required);
        this.ctlPseudo = this.formBuilder.control('', Validators.required);

        this.signupForm = this.formBuilder.group({
            pseudo : this.ctlPseudo,
            lastname: this.ctlLastName,
            firstname: this.ctlFirstName,
            email: this.ctlEmail,
            birthDate: this.ctlBirthday,
            title: this.ctlTitle,
            password: this.ctlPassword,
            confirmPassword : this.ctlConfirmPassword
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    get f() { return this.signupForm.controls; }

    /**
     * Cette méthode est bindée sur l'événement onsubmit du formulaire. On va y faire le
     * login en faisant appel à AuthenticationService.
     */
     onSubmit() {
        this.submitted = true;

        // on s'arrête si le formulaire n'est pas valide
        if (this.signupForm.invalid) return;
        
        this.loading = true;

        

        let formObj = this.signupForm.getRawValue(); // {name: '', description: ''}
        const user = new User(formObj);
        //console.log(user);
        
        this.userService.signup(this.f.pseudo.value,this.f.firstname.value,
            this.f.lastname.value, this.f.email.value,this.f.birthDate.value, this.f.title.value, this.f.password.value )
            .subscribe(
                // si signup est ok, on navigue vers la page demandée
                data => {
                    //console.log("success !");
                    this.authenticationService.login(this.f.email.value, this.f.password.value);
                    //this.router.navigate([this.returnUrl]);
                },
                // en cas d'erreurs, on reste sur la page et on les affiche
                error => {
                    console.log(error.error.errors);
                });
        
                
    }
}