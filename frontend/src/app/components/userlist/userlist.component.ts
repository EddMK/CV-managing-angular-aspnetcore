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


@Component({
    selector: 'app-userlist', // sélecteur utilisé pour un sous-composant
    templateUrl: './userlist.component.html',
    styleUrls: ['./userlist.component.css']
})

export class UserListComponent implements AfterViewInit, OnDestroy {

    connectedUser : User | undefined;

    displayedColumns: string[] = ['firstName','lastName', 'email', 'title', 'actions', 'cv', 'delete'];
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
        private authenticationService: AuthenticationService
        
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
        // lie le datasource au sorter et au paginator
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // définit le predicat qui doit être utilisé pour filtrer les membres
        this.dataSource.filterPredicate = (data: User, filter: string) => {
            const str = data.firstname + ' ' + data.lastname + ' ' + data.email + '  ' + data.title + '  ' + data.role;
        
            
            return str.toLowerCase().includes(filter);
        };
        // établit les liens entre le data source et l'état de telle sorte que chaque fois que 
        // le tri ou la pagination est modifié l'état soit automatiquement mis à jour
        this.state.bind(this.dataSource);
        // récupère les données 
        this.refresh();
    }

    refresh() {
        this.userService.getTeam(this.connectedUser?.userId!).subscribe(users => {
            // assigne les données récupérées au datasource
            /*var consultants :User[] = []*/
            for(var i = 0; i < users.length; ++i){
               console.log(users[i]);
            }
               /*
            }*/
            

            this.dataSource.data = users;
            // restaure l'état du datasource (tri et pagination) à partir du state
            this.state.restoreState(this.dataSource);
            // restaure l'état du filtre à partir du state
            this.filter = this.state.filter;
        });
    }

    // appelée chaque fois que le filtre est modifié par l'utilisateur
    filterChanged(e: KeyboardEvent) {
        const filterValue = (e.target as HTMLInputElement).value;
        // applique le filtre au datasource (et provoque l'utilisation du filterPredicate)
        this.dataSource.filter = filterValue.trim().toLowerCase();
        // sauve le nouveau filtre dans le state
        this.state.filter = this.dataSource.filter;
        // comme le filtre est modifié, les données aussi et on réinitialise la pagination
        // en se mettant sur la première page
        if (this.dataSource.paginator)
            this.dataSource.paginator.firstPage();
    }

   // console.log here to check some value
   // remove consultant from consultant list 
   unLink(user: User){
     console.log("unlink " + user.firstname + "to the team" + user.managerID)
     
     this.userService.unLink(user).subscribe(res => {
        this.refresh(); 
     });
   }
   // link a consultant without manager to your list
   link(user: User){
    console.log("link " + user.firstname + "to the team")
    this.userService.Link(user, this.currentUser?.userId!).subscribe(res => {
        this.refresh(); 
     });

   }
   // check cv of your consultant
   checkCV(user: User){
    console.log("check " + user.firstname + "cv")
    this.cvAuthor(user);
    this.isCvChecked = true;
     
   }

   returnOnClick(){
       this.isCvChecked = false;
   }


    // appelée quand on clique sur le bouton "delete" d'un membre
    delete(user: User) {
        const backup = this.dataSource.data;
        this.dataSource.data = _.filter(this.dataSource.data, u => u.email !== user.email);
        const snackBarRef = this.snackBar.open(`User '${user.email}' will be deleted`, 'Undo', { duration: 10000 });
        snackBarRef.afterDismissed().subscribe(res => {
            if (!res.dismissedByAction)
                this.userService.delete(user).subscribe();
            else
                this.dataSource.data = backup;
        });
    }
   
   
    ngOnDestroy(): void {
        this.snackBar.dismiss();
    }

}
