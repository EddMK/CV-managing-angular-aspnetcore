import { Component, Input, OnInit, OnChanges , SimpleChanges, SimpleChange} from '@angular/core';

import { CVComponent } from '../CV/CV.component';

import { User } from 'src/app/models/User';
import { Experience } from 'src/app/models/Experience';
import { UsingService } from 'src/app/services/using.service';
import { Using } from 'src/app/models/Using';
import { iif, Observable, Subscription } from 'rxjs';



@Component({
  selector: 'app-usinglist',
  templateUrl: './usinglist.component.html',
  styles: [
  ]
})
export class UsinglistComponent implements OnInit{


  @Input() public set IdExperience(experience: Experience | undefined){
    console.log(experience);
    if (experience != undefined) {
      console.log("ideexperience : " + experience?.title+ ", " + experience?.idExperience + " , "  +  experience.usings.length);
      this.usingService.GetLanguagesById(experience?.idExperience!).subscribe(u => {
         this.languages = u;
      });
      this.usingService.GetDatabasesById(experience?.idExperience!).subscribe(u => {
        this.databases = u;
     });
     this.usingService.GetFrameworksById(experience?.idExperience!).subscribe(u => {
        this.frameworks = u;
     });
    }
} 
  constructor(public usingService : UsingService){
   }
 
  
  @Input() public connectedUser! : User | undefined

  languages : Using[] = [];
  databases : Using[] = [];
  frameworks : Using[] = [];

  public ngOnInit(): void {
      
  }

  isNotEmpty(category : string) : boolean{
    switch (category) {
      case "Languages":
        return this.languages.length == 0 ? true : false;
          
      case "Databases":
        return this.databases.length == 0 ? true : false;
          
      case "Frameworks":
        return this.frameworks.length == 0 ? true : false;   
    }
    return false;
  }

 
}