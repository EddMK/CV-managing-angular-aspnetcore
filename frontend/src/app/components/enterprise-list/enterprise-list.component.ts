import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { Enterprise } from '../../models/Enterprise';
import { EnterpriseService } from '../../services/enterprise.service';
//import { EditMemberComponent } from '../edit-member/edit-member.component';
import { StateService } from 'src/app/services/state.service';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { plainToClass } from 'class-transformer';
import { EditEnterpriseComponent } from '../edit-enterprise/edit-enterprise.component';
import { ConfirmService } from 'src/app/services/confirm.service';

@Component({
    templateUrl: './enterprise-list.component.html',
    styleUrls: ['./enterprise-list.component.css']
})
export class EnterpriseListComponent implements AfterViewInit, OnDestroy {
    displayedColumns: string[] = ['name', 'actions'];
    dataSource: MatTableDataSource<Enterprise> = new MatTableDataSource();
    filter: string = '';
    state: MatTableState;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private EnterpriseService: EnterpriseService,
        private stateService: StateService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private confirmService: ConfirmService
    ) {
        this.state = new MatTableState('name', 'asc', 5);
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: Enterprise, filter: string) => {
            const str = data.name + ' ';
            return str.toLowerCase().includes(filter);
        };
        this.state.bind(this.dataSource);
        this.refresh();
    }

    refresh() {
        console.log("arrive !");
        this.EnterpriseService.getAll().subscribe( enterprises => {
            this.dataSource.data = enterprises;
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

    edit(enterprise: Enterprise) {
        const dlg = this.dialog.open(EditEnterpriseComponent, { data: { enterprise, isNew: false } });
        dlg.beforeClosed().subscribe(res => {
            if (res) {
                _.assign(enterprise, res);
                res = plainToClass(Enterprise, res);
                this.EnterpriseService.update(res).subscribe(res => {
                    if (!res) {
                        this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
                        this.refresh();
                    }
                });
            }
        });
    }


    delete(enterprise: Enterprise) {
        var dialog = this.confirmService.confirmDialog({title: 'Confirm delete' ,
         message: 'Are you sure you want to delete ' + enterprise?.name + '? If you do so all the missions related will be also deleted', 
         confirmText: 'Confirm', 
         canceltext: 'Cancel'});
         dialog.subscribe(res => {
            if(res){
                this.EnterpriseService.delete(enterprise).subscribe(res => {
                    this.refresh(); 
                 });
                
            }
        })
    }

    create() {
        const enterprise = new Enterprise();
        const dlg = this.dialog.open(EditEnterpriseComponent, { data: { enterprise, isNew: true } });
        dlg.beforeClosed().subscribe(res => {
            if (res) {
                res = plainToClass(Enterprise, res);
                this.dataSource.data = [...this.dataSource.data, res];
                var res2 = {name : res.name};
                this.EnterpriseService.add(res2).subscribe(res => {
                    if (!res) {
                        this.snackBar.open(`There was an error at the server. The member has not been created! Please try again.`, 'Dismiss', { duration: 10000 });            
                    }
                    this.refresh();
                });
            }
        });
    }

    ngOnDestroy(): void {
        this.snackBar.dismiss();
    }
}
