import { Component, OnInit } from '@angular/core';

import { CVComponent } from '../CV/CV.component';
import { Mastering } from 'src/app/models/Mastering';
import { MasteringService } from 'src/app/services/mastering.service';




@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styles: [
  ]
})
export class SkillsComponent  implements OnInit {
  
   masterings : Mastering[] = [];
   languages : Mastering[] = [];
   databases : Mastering[] = [];
   framework : Mastering[] = [];

   constructor(public masteringService : MasteringService){
       masteringService.getAll().subscribe(m => {
           this.masterings = m;
           this.initCategories("Language");
           this.initCategories("database");
           this.initCategories("frameworks");
       });
   }

   initCategories(category : String) : void {
    for (var val of this.masterings) {
        if(val.categoryToString == category)
            this.languages.fill(val);
     }
   }
  

  ngOnInit(): void {
    
  }



}
