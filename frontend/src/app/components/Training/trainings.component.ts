import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { Experience } from 'src/app/models/Experience';
import { CVComponent } from '../CV/CV.component';
import { TitleComponent } from '../title/title.component';
import { TrainingService } from 'src/app/services/training.service';


@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: [ './trainings.component.css']
})
export class TrainingsComponent implements OnInit {
  
  @Input() public set connectedUser(user: User | undefined) {
    
    if (user != undefined) {
      console.log("user : " + user?.firstname + ", " + user?.userId);
      this.trainingService.GetAllTraingById(user?.userId!).subscribe(t => {
        this.trainings = t;
      });
    }
}


  ngOnInit(): void {
    
  }

  trainings : Experience[] = [];

  constructor(public trainingService :  TrainingService){

  }



}