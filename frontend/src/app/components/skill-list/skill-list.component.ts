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
        public snackBar: MatSnackBar
    ) {
        this.state = new MatTableState('skill', 'asc', 5);
        this.categories = new Map().set(1,"Language").set(2,"Database").set(3,"Framework");
    }

    ngAfterViewInit(): void {
        // lie le datasource au sorter et au paginator
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // définit le predicat qui doit être utilisé pour filtrer les skill
        this.dataSource.filterPredicate = (data: Skill, filter: string) => {
            const str =  data.name + ' ' + data.category?.name;
            return str.toLowerCase().includes(filter);
        };
        // établit les liens entre le data source et l'état de telle sorte que chaque fois que 
        // le tri ou la pagination est modifié l'état soit automatiquement mis à jour
        this.state.bind(this.dataSource);
        // récupère les données 
        this.refresh();
    }

    refresh() {
        
        this.SkillService.getAll().subscribe(skills => {
            console.log(skills);
            // assigne les données récupérées au datasource
            this.dataSource.data = skills;
            // restaure l'état du datasource (tri et pagination) à partir du state
            this.state.restoreState(this.dataSource);
            // restaure l'état du filtre à partir du state
            this.filter = this.state.filter;
        });
        
    }

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
/*
    getCategory( form : any) :void{
        this.SkillService.getCategory(form).subscribe(category => {
            var newCategory = plainToClass(Category, category);
            this.newCategory = newCategory;
            console.log(newCategory);
        });
    }
*/
    edit(skill : Skill):void{
        const dlg = this.dialog.open(EditSkillComponent, { data: { skill, isNew: false } });
        dlg.beforeClosed().subscribe(res => {
            if (res) {
                /*
                this.SkillService.getCategory(res).subscribe(category => {
                    var newCategory = plainToClass(Category, category);
                    this.newCategory = newCategory;
                    console.log(newCategory);
                });
                res.category = this.newCategory;
                */
                //this.categories.get(res.categoryId);
                console.log(res.skillId);
                let newCategory : Category = { categoryId : res.categoryId, name :this.categories.get(res.categoryId) };
                res.category = newCategory;
                console.log("category apres l'appel de méthode : " + newCategory.name);
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

    delete(skill : Skill): void{
        const backup = this.dataSource.data;
        this.dataSource.data = _.filter(this.dataSource.data, s => s.name !== skill.name);
        const snackBarRef = this.snackBar.open(`Skill '${skill.name}' will be deleted`, 'Undo', { duration: 10000 });
        snackBarRef.afterDismissed().subscribe(res => {
            if (!res.dismissedByAction)
                this.SkillService.delete(skill).subscribe();
            else
                this.dataSource.data = backup;
        });
    }

    // appelée quand on clique sur le bouton "new member"
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