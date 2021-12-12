import { Component, Input } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';




@Component({
    selector: 'app-CV',
    templateUrl: './CV.component.html',


})
export class CVComponent{
    
   
    constructor(private authenticationService: AuthenticationService) {
       
    }
    
    get currentUser()  {
        return this.authenticationService.currentUser;
    }
  
    
   
}

