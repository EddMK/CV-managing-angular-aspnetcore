import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
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

  @Input() public connectedUser! : User | undefined

  userId : number | undefined;
  
   masterings : Mastering[] = [];
   

   constructor(public masteringService : MasteringService){
       this.userId = this.connectedUser?.id
       masteringService.getAllById(1).subscribe(m => {
           this.masterings = m;
         
       });
   }

  

  ngOnInit(): void {
    
  }



}
