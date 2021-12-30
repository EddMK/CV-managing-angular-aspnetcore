import { Component, Input, OnInit } from '@angular/core';

import { CVComponent } from '../CV/CV.component';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/User';
import { EditTitleComponent } from '../edit-title/edit-title.component';
import { MatDialog } from '@angular/material/dialog';
import { plainToClass } from 'class-transformer';
import { StateService } from 'src/app/services/state.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'lodash';


@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styles: [
  ]
})
export class TitleComponent implements OnInit {
  
  @Input() public connectedUser! : User | undefined


  isEditable :  boolean = false;

  ngOnInit(): void {
       
  }

  constructor(public dialog: MatDialog, public userService : UserService,  
    private stateService: StateService, public snackBar: MatSnackBar, private authenticationService: AuthenticationService){
    
  }
   
  get currentUser()  {
    return this.authenticationService.currentUser;
  }
  isUserConnected() : boolean {
    return this.connectedUser?.userId == this.currentUser?.userId
  }


   edit(user : User){
    if(this.isUserConnected()){
    const dlg = this.dialog.open(EditTitleComponent, { data: { user,  isNew: false } });
    console.log(user.firstname + " " + user.userId);
    dlg.beforeClosed().subscribe(res => {
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
     });
    }
   }

   
   refresh() {
     // refresh when updated
    
       
    }



}
