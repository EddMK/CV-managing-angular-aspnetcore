import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/User';
import { Experience } from 'src/app/models/Experience';
import { CVComponent } from '../CV/CV.component';
import { TitleComponent } from '../title/title.component';
import { ExperienceService } from 'src/app/services/experience.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Using } from 'src/app/models/Using';
import { Skill } from 'src/app/models/Skill';
import { Enterprise } from 'src/app/models/Enterprise';
import { UsingService } from 'src/app/services/using.service';
import { MatDialog } from '@angular/material/dialog';
import { EditExperienceComponent } from '../edit-experience/edit-experience.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ConfirmService } from 'src/app/services/confirm.service';
import * as _ from 'lodash-es';
import { plainToClass } from 'class-transformer';
import { Subject } from 'rxjs';



@Component({
  selector: 'app-experiences',
  templateUrl: './experiences.component.html',
  styleUrls: [ './experiences.component.css']
})
export class ExperiencesComponent implements OnInit {

  @Input() public set connectedUser(user: User | undefined) {
    
    if (user != undefined) {
      this.experienceService.GetAllTraingById(user?.userId!).subscribe(t => {
        this.trainings = t;
      });
      this.experienceService.GetAllMissionById(user?.userId!).subscribe(t => {
        console.log(t)
        this.missions = t;
      });
      if(user == this.currentUser){
        this.isUserConnected = true;
      }
    }
  }

  eventsSubject: Subject<void> = new Subject<void>();

  emitEventToChild() {
    this.eventsSubject.next();
  }

  ngOnInit(): void {
    
  }

  trainings : Experience[] = [];
  missions : Experience[] = [];
  isEditableTraining :  boolean = false;
  isEditableMission :  boolean = false;
  isAddableTraining :  boolean = false;
  isAddableMission:  boolean = false;
  isUserConnected : boolean = false;
   

  onEditTraining() {
    if(!this.isEditableTraining){
       this.isEditableTraining = true;
    }
    else {
      this.isEditableTraining = false;
    }
  }


  onAddMission() {
    if(!this.isAddableMission){
       this.isAddableMission = true;
    }
    else {
      this.isAddableMission = false;
    }
  }

  onAddTraining() {
    if(!this.isAddableTraining){
       this.isAddableTraining = true;
    }
    else {
      this.isAddableTraining = false;
    }
  }

  onEditMission() {
    if(!this.isEditableMission){
       this.isEditableMission = true;
    }
    else {
      this.isEditableMission = false;
    }
  }

  addExperience(category : string):void{
    const training = new Experience();
    if(this.isUserConnected){
      const dlg = this.dialog.open(EditExperienceComponent, { data: { training, isNew: true, isMission : category=="MISSION"?true : false}, height : '150%', width : '50%' });
      dlg.beforeClosed().subscribe(res => {
        if (res) {
          var enterprise : Enterprise = { idEnterprise : 5, name : "Odoo", enterpriseRole : "client"};
          res.client = enterprise;
          res.userId = this.currentUser?.userId!;
          res.role = category;
          if(category === "Mission"){
            res.client = null;
          }
          res = plainToClass(Experience, res);
          console.log(res);
          this.experienceService.addExperience(res).subscribe(idexperience => {
            res.idExperience = idexperience;
            if (!idexperience) {
              this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
            }
            this.refreshAll();
          });
        }
      });
    }

  }       

  editExperience(training : Experience):void{
    if(this.isUserConnected){
      const enterprise = training.enterprise;
      const dlg = this.dialog.open(EditExperienceComponent, { data: { training, isNew: false}, height : '150%', width : '50%' });
      dlg.beforeClosed().subscribe(res => {
          if (res) {
            res.enterprise = enterprise;
            _.assign(training, res);
            res = plainToClass(Experience, training);
            this.experienceService.updateExperience(res).subscribe(res => {
              if (!res) {
                this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
              }
              this.refreshAll();
            });
          }
      });
    }
  }

  deleteExperience(experience: Experience) {
    var dialog = this.confirmService.confirmDialog({title: 'Confirm delete' ,
     message: 'Are you sure you want to delete ' + experience.title + '? If you do so all the missions related will be also deleted', 
     confirmText: 'Confirm', 
     canceltext: 'Cancel'});
     dialog.subscribe(res => {
        if(res){
            this.experienceService.deleteExperience(experience).subscribe(res => {
              this.refreshAll(); 
            });
        }
    })
}

  refreshTraining() : void{
    this.experienceService.GetAllTraingById(this.currentUser?.userId!).subscribe(t => {
      this.trainings = t;
    });
  }

  refreshMission() : void{
    this.experienceService.GetAllMissionById(this.currentUser?.userId!).subscribe(t => {
      this.missions = t;
    });
  }

  refreshAll() : void{
    this.refreshMission();
    this.refreshTraining();
  }

  constructor(public experienceService :  ExperienceService, public usingService : UsingService,
    public dialog: MatDialog, public snackBar: MatSnackBar, private authenticationService: AuthenticationService, private confirmService: ConfirmService){
  }

  get currentUser()  {
    return this.authenticationService.currentUser;
  }

}