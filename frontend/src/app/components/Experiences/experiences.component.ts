import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { Experience } from 'src/app/models/Experience';
import { CVComponent } from '../CV/CV.component';
import { TitleComponent } from '../title/title.component';
import { ExperienceService } from 'src/app/services/experience.service';
import { Using } from 'src/app/models/Using';
import { UsingService } from 'src/app/services/using.service';
import { MatDialog } from '@angular/material/dialog';
import { EditTrainingComponent } from '../edit-training/edit-training.component';
import { AuthenticationService } from 'src/app/services/authentication.service';



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
      if(user == this.currentUser){
        this.isUserConnected = true;
      }

    }
}

  ngOnInit(): void {
    
  }

  trainings : Experience[] = [];
  missions : Experience[] = [];
  isEditableTraining :  boolean = false;
  isUserConnected : boolean = false;
   

  onEditTraining() {
    console.log("TOUCHE TRAINING !");
    if(!this.isEditableTraining){
       this.isEditableTraining = true;
    }
    else {
      this.isEditableTraining = false;
    }
  }

  isEditableMission :  boolean = false;

  onEditMission() {
    console.log("TOUCHE MISSION!");
    if(!this.isEditableMission){
       this.isEditableMission = true;
    }
    else {
      this.isEditableMission = false;
    }
  }

  editTraining(training : Experience):void{
    if(this.isUserConnected){
    console.log("edit training");
    const dlg = this.dialog.open(EditTrainingComponent, { data: { training, isNew: false }, height : '150%', width : '50%' });
    dlg.beforeClosed().subscribe(res => {
        if (res) {
        }
    });
  }
  }

  constructor(public experienceService :  ExperienceService, public dialog: MatDialog, private authenticationService: AuthenticationService){

  }

  get currentUser()  {
    return this.authenticationService.currentUser;
  }
  



}