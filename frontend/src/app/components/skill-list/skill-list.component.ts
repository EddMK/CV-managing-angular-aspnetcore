import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Skill } from 'src/app/models/Skill';
import { Category } from 'src/app/models/Category';
import { StateService } from 'src/app/services/state.service';
import { SkillService } from '../../services/skills.service';
import { plainToClass } from 'class-transformer';
import { EditSkillComponent } from 'src/app/components/edit-skill/edit-skill.component';
import { ConfirmService } from 'src/app/services/confirm.service';

import * as _ from 'lodash-es';
import * as internal from 'assert';
import { LiteralExpr } from '@angular/compiler';

@Component({
    templateUrl: './skill-list.component.html',
    styleUrls: ['./skill-list.component.css']
})
export class SkillListComponent implements AfterViewInit, OnDestroy{
    displayedColumns: string[] = [ 'name', 'category','actions'];
    dataSource: MatTableDataSource<Skill> = new MatTableDataSource();
    filter: string = '';
    state: MatTableState;
    categories : Map<number, string>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private SkillService: SkillService,
        private stateService: StateService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar, 
        private confirmService: ConfirmService
    ) {
        this.state = new MatTableState('skill', 'asc', 5);
        this.categories = new Map().set(1,"Language").set(2,"Database").set(3,"Framework");
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: Skill, filter: string) => {
            const str =  data.name + ' ' + data.category?.name;
            return str.toLowerCase().includes(filter);
        };
        this.state.bind(this.dataSource);
        this.refresh();
    }

    refresh() {
        this.SkillService.getAll().subscribe(skills => {
            this.dataSource.data = skills;
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

    edit(skill : Skill):void{
        const dlg = this.dialog.open(EditSkillComponent, { data: { skill, isNew: false } });
        dlg.beforeClosed().subscribe(res => {
            if (res) {
                let newCategory : Category = { categoryId : res.categoryId, name :this.categories.get(res.categoryId) };
                res.category = newCategory;
                _.assign(skill, res);
                res = plainToClass(Skill, res);
                this.SkillService.update(res).subscribe(res => {
                    if (!res) {
                        this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
                        this.refresh();
                    }
                });
            }
        });
    }

   

    delete(skill: Skill) {
        var dialog = this.confirmService.confirmDialog({title: 'Confirm delete' ,
         message: 'Are you sure you want to delete  ' + skill?.name + '?, If you do so all the masterings and usings related will also be deleted', 
         confirmText: 'Confirm', 
         canceltext: 'Cancel'});
         dialog.subscribe(res => {
            if(res){
                this.SkillService.delete(skill).subscribe(res => {
                    this.refresh(); 
                 });
                
            }
        })
    }

    create() {
        const skill = new Skill();
        const dlg = this.dialog.open(EditSkillComponent, { data: { skill, isNew: true } });
        dlg.beforeClosed().subscribe(res => {
            if (res) {
                let newCategory : Category = { categoryId : res.categoryId, name :this.categories.get(res.categoryId) };
                res.category = newCategory;
                res = plainToClass(Skill, res);
                this.dataSource.data = [...this.dataSource.data, res];
                var res2 = {name : res.name, categoryId : res.categoryId};
                this.SkillService.add(res2).subscribe(res2 => {
                    if (!res2) {
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