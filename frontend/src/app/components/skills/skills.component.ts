import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { CVComponent } from '../CV/CV.component';
import { Mastering } from 'src/app/models/Mastering';
import { MasteringService } from 'src/app/services/mastering.service';
import { isDefined } from '@angular/compiler/src/util';



@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent  implements OnInit {

  @Input() public set connectedUser(user: User | undefined) {
    
      if (user != undefined) {
        console.log("user : " + user?.firstname + ", " + user?.userId + " , " + user?.managerID);
        this.masteringService.getAllById(user?.userId!).subscribe(m => {
          this.masterings = m;
        });
      }
  }


   masterings : Mastering[] = [];
   
   constructor(public masteringService : MasteringService){
  
   }

  

  ngOnInit(): void {
    
  }


}
