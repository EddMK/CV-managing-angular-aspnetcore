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
      }
  }


   masterings : Mastering[] = [];
   
   constructor(public masteringService : MasteringService, public dialog: MatDialog, public snackBar: MatSnackBar,  private authenticationService: AuthenticationService){
  
   }

   isEditable :  boolean = false;

   get currentUser()  {
    return this.authenticationService.currentUser;
   }
   isUserConnected() : boolean {
    return this.connectedUser?.userId == this.currentUser?.userId
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
    if(this.isUserConnected()){
    const dlg = this.dialog.open(EditCompetencesComponent, { data: { masterings,  isNew: false } });
    console.log(masterings);
    /*dlg.beforeClosed().subscribe(res => {
      if (res) {
         console.log(res);
          _.assign(user, res);
          res = plainToClass(User, res);
          console.log(res);
          console.log(res.email);
          this.userService.update(res).subscribe(res => {
              if (!res) {
                  this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
                  this.refresh();
              }
          });
      }
  });*/
     } 
   }



  

  ngOnInit(): void {
    
  }


}
