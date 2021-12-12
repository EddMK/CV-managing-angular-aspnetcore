import { Component, Input, OnInit } from '@angular/core';

import { CVComponent } from '../CV/CV.component';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/User';


@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styles: [
  ]
})
export class TitleComponent extends CVComponent implements OnInit {
  
  

  ngOnInit(): void {
     
  }



}
