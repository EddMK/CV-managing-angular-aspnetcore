import { Component, OnInit } from '@angular/core';

import { CVComponent } from '../CV/CV.component';
import { Mastering } from 'src/app/models/User';
import { MasteringService } from 'src/app/services/mastering.service';




@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styles: [
  ]
})
export class SkillsComponent  implements OnInit {
  
   masterings : Mastering[] = [];

   constructor(public masteringService : MasteringService){
       masteringService.getAll().subscribe(m => {
           this.masterings = m;
           console.log(m);
       });
   }
  

  ngOnInit(): void {
    
  }



}
