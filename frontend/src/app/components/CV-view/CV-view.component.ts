import { Component, Input } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';




@Component({
    selector: 'app-CV-view',
    templateUrl: './CV-view.component.html',


})
export class CVviewComponent{
    
    //connectedUser : User | undefined;

    consultant : User | undefined;
    
    
    constructor(public user : User) {
       this.consultant = user;
    }
    
    /*get currentUser()  {
        return this.authenticationService.currentUser;
    }*/
  
    
   
}

