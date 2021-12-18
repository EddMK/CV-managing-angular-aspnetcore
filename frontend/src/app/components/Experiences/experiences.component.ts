import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { Experience } from 'src/app/models/Experience';
import { CVComponent } from '../CV/CV.component';
import { TitleComponent } from '../title/title.component';
import { ExperienceService } from 'src/app/services/experience.service';


@Component({
  selector: 'app-experiences',
  templateUrl: './experiences.component.html',
  styleUrls: [ './experiences.component.css']
})
export class ExperiencesComponent implements OnInit {
  
  @Input() public set connectedUser(user: User | undefined) {
    
    if (user != undefined) {
      console.log("user : " + user?.firstname + ", " + user?.userId);
      this.experienceService.GetAllTraingById(user?.userId!).subscribe(t => {
        this.trainings = t;
      });
      this.experienceService.GetAllMissionById(user?.userId!).subscribe(t => {
        this.missions = t;
      });

    }
}


  ngOnInit(): void {
    
  }

  trainings : Experience[] = [];
  missions : Experience[] = [];

  constructor(public experienceService :  ExperienceService){

  }



}