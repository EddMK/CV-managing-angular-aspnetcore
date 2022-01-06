import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { CVComponent } from '../CV/CV.component';
import { Mastering } from 'src/app/models/Mastering';
import { MasteringService } from 'src/app/services/mastering.service';
import { isDefined } from '@angular/compiler/src/util';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditCompetencesComponent } from '../edit-competences/edit-competences.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { plainToClass } from 'class-transformer';
import * as _ from 'lodash';



@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent  implements OnInit {

  @Input() public set connectedUser(user: User | undefined) {
      if (user != undefined) {
        console.log("user : " + user?.firstname + ", " + user?.userId + " , " + user?.manager);
        this.masteringService.getAllById(user?.userId!).subscribe(m => {
          this.masterings = m;
        });
        if(user == this.currentUser){
          this.isUserConnected = true;
        }
      }
  }
   
   isUserConnected : boolean = false;
   
   masterings : Mastering[] = [];
   
   constructor(public masteringService : MasteringService, public dialog: MatDialog, public snackBar: MatSnackBar,  private authenticationService: AuthenticationService){
  
   }

   isEditable :  boolean = false;

   get currentUser()  {
    return this.authenticationService.currentUser;
   }


   onEditMode() {
     if(!this.isEditable){
        this.isEditable = true;
     }
     else {
       this.isEditable = false;
     }
   }

   edit(masterings : Mastering[]){
    if(this.isUserConnected){
    const dlg = this.dialog.open(EditCompetencesComponent, { data: { masterings,  isNew: false } });
    console.log(masterings);
    dlg.beforeClosed().subscribe(res => {
       if (res) {
          console.log(res);
          _.assign(masterings, res);
          res = plainToClass(Mastering, res);
          console.log(res);
          console.log(res.email);
          this.masteringService.update(res, this.currentUser?.userId!).subscribe(res => {
                this.refresh();
          });
       }
    }); 
    }
    }

   public refresh(){
      this.masteringService.getAllById(this.currentUser?.userId!).subscribe(m => {
      this.masterings = m;
      });
   }

  ngOnInit(): void {
    
  }


}
