import { Component } from '@angular/core';
import { SkillService } from '../../services/skills.service';
import { Skill } from 'src/app/models/Skill';



@Component({
    templateUrl: './session2.component.html',
    styleUrls: ['./session2.component.css']

})
export class Session2Component {
    skillSelected : Skill ;
    skillsList: Skill[] = [];
    average : number;

    constructor(
        private SkillService: SkillService
    ) {
        this.skillSelected = new Skill();
        this.average = 0;
    }

    ngAfterViewInit(): void {
        this.refresh();
    }

    refresh() {
        this.SkillService.getAll().subscribe(skills => {
            this.skillsList = skills;
        });
    }

    changeClient(value : Skill) {
        console.log(value);
        this.skillSelected = value;
    }

    updateAverage(newItem: number) {
        console.log("Parent : "+newItem);
        this.average = newItem;
    }
   
}