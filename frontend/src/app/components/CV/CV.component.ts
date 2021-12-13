import { Component, Input } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';




@Component({
    selector: 'app-CV',
    templateUrl: './CV.component.html',


})
export class CVComponent{
    
    connectedUser : User | undefined;
    
    
    constructor(private authenticationService: AuthenticationService) {
       this.connectedUser = this.currentUser
     
    }
    
    get currentUser()  {
        return this.authenticationService.currentUser;
    }
  
    
   
}

