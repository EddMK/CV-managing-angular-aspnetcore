import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { CVComponent } from '../CV/CV.component';
import { Level, Mastering } from 'src/app/models/Mastering';
import { MasteringService } from 'src/app/services/mastering.service';
import { isDefined } from '@angular/compiler/src/util';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditCompetencesListComponent } from '../edit-competences-list/edit-competences-list.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { plainToClass } from 'class-transformer';
import * as _ from 'lodash';
import { UsingService } from 'src/app/services/using.service';
import { SkillService } from 'src/app/services/skills.service';
import { Skill } from 'src/app/models/Skill';
import { Using } from 'src/app/models/Using';



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
        this.usingService.GetUsingById(user?.userId!).subscribe(u => {
          this.usings = u;
        });
        this.skillService.getAll().subscribe(s => {
          this.skills = s;
        })
        if(user == this.currentUser){
          this.isUserConnected = true;
        }
      }
  }
   
   isUserConnected : boolean = false;
   
   masterings : Mastering[] = [];
   skills: Skill[] = [];
   skillsToAdd: Skill[] = [];
   public usings: Using[] = [];
   
   constructor(
     public masteringService : MasteringService, 
     public dialog: MatDialog, 
     public snackBar: MatSnackBar, 
     private usingService: UsingService,
     private skillService: SkillService,
     private authenticationService: AuthenticationService)
     {
      
     }

   isEditable :  boolean = false;

   get currentUser()  {
    return this.authenticationService.currentUser;
   }

   isNotEmpty(category : string) : boolean{
      if(this.masterings.filter(m => m.categoryToString === category).length === 0){
        return false;
      }
      return true;
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
       this.listAvalaibleSkills();
     console.log(this.skillsToAdd.length)
     const dlg = this.dialog.open(EditCompetencesListComponent, { data: { masterings, isNew: true } });
     console.log(masterings);
       dlg.beforeClosed().subscribe(res => {
         if (res) {
             this.refresh();
          }
       }); 
     }
    }

   public refresh(){
      this.masteringService.getAllById(this.currentUser?.userId!).subscribe(m => {
      this.masterings = m;
      });
   }

   
  listAvalaibleSkills() {
    for(let s of this.skills){
        for(let u of this.usings){
            if(s.name === u.usingToString && !this.isUsingUsed(u)){
                this.skillsToAdd.push(s);
               
            }
            console.log(s.skillId + "  : " + u.usingToString );
        }
     } 
 }
 isUsingUsed(using : Using) : boolean{
    for(let m of this.masterings){
        if(m.skill?.name === using.usingToString){
            return true;
        }
    }
    return false;
 }

  ngOnInit(): void {
    
  }


}
