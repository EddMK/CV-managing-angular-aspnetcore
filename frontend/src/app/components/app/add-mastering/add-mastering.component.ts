import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Level, Mastering } from "src/app/models/Mastering";
import { Skill } from "src/app/models/Skill";
import { User } from "src/app/models/User";
import { MasteringService } from "src/app/services/mastering.service";
import { SkillService } from "src/app/services/skills.service";


@Component({
    selector: 'app-add-mastering',
    templateUrl: './add-mastering.component.html',


})
export class AddMastering {


    public frm!: FormGroup;
    //public selected: number;

    public masterings: Mastering[] | undefined;
    
    public skillsToAdd! : Skill[];
    selectedSkill!: Skill;
    selectedLevel!: Level;


    @Input() public connectedUser : User | undefined;
    @Output() public newRefreshEvent = new EventEmitter<number>();

    $emit: any;
  
    constructor(private masteringService: MasteringService, private skillService : SkillService) {
        this.skillService.getAll().subscribe(res => {
            this.skillsToAdd = res;
        });
        
    }






}
    