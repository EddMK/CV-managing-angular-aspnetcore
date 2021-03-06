import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { StateService } from 'src/app/services/state.service';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { plainToClass } from 'class-transformer';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Console } from 'console';
import { ConfirmService } from 'src/app/services/confirm.service';


@Component({
    selector: 'app-userlist', // sélecteur utilisé pour un sous-composant
    templateUrl: './userlist.component.html',
    styleUrls: ['./userlist.component.css']
})

export class UserListComponent implements AfterViewInit, OnDestroy {

    connectedUser : User | undefined;

    displayedColumns: string[] = ['firstName','lastName', 'email', 'title', 'check', 'actions', 'cv', 'delete'];
    dataSource: MatTableDataSource<User> = new MatTableDataSource();
    filter: string = '';
    state: MatTableState;

    isCvChecked : boolean;
    selectedUser : User | undefined;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private userService: UserService,
        private stateService: StateService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private authenticationService: AuthenticationService,
        private confirmService: ConfirmService
        
    ) {
        this.state = this.stateService.userListState;
        this.connectedUser = this.currentUser
        this.isCvChecked = false;
    }

    get currentUser()  {
        return this.authenticationService.currentUser;
    }

     cvAuthor(user : User) : void{
       this.selectedUser = user;
    }


    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: User, filter: string) => {
            const str = data.firstname + ' ' + data.lastname + ' ' + data.email + '  ' + data.title + '  ' + data.role;
        
            
            return str.toLowerCase().includes(filter);
        };
      
        this.state.bind(this.dataSource);
     
        this.refresh();
    }

    refresh() {
        this.userService.getTeam(this.connectedUser?.userId!).subscribe(users => {
            this.dataSource.data = users;
         
            this.state.restoreState(this.dataSource);
    
            this.filter = this.state.filter;
        });
    }

 
    filterChanged(e: KeyboardEvent) {
        const filterValue = (e.target as HTMLInputElement).value;

        this.dataSource.filter = filterValue.trim().toLowerCase();
  
        this.state.filter = this.dataSource.filter;
       
        if (this.dataSource.paginator)
            this.dataSource.paginator.firstPage();
    }

   unLink(user: User){
  
     
     this.userService.unLink(user).subscribe(res => {
        this.refresh(); 
     });
   }
 
   link(user: User){
    console.log("link " + user.firstname + "to the team")
    this.userService.Link(user, this.currentUser?.userId!).subscribe(res => {
        this.refresh(); 
     });

   }
   checkCV(user: User){
    console.log("check " + user.firstname + "cv")
    this.cvAuthor(user);
    this.isCvChecked = true;
     
   }

   returnOnClick(){
       this.isCvChecked = false;
   }


    delete(user: User) {
        var fullname = user.firstname + " " + user.lastname;
        var dialog = this.confirmService.confirmDialog({title: 'Confirm delete' ,
         message: 'Are you sure you want to delete ' + fullname + '? If you do so all the masterings and experiences related will be also deleted', 
         confirmText: 'Confirm', 
         canceltext: 'Cancel'});
        dialog.subscribe(res => {
            if(res){
                this.userService.delete(user).subscribe(res => {
                    this.refresh(); 
                 });
                
            }
        })
    }
   
   
    ngOnDestroy(): void {
        this.snackBar.dismiss();
    }

}
