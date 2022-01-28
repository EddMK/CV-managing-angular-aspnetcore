import { Component, Input, OnChanges, SimpleChanges, Output , EventEmitter} from '@angular/core';
import { Mastering } from 'src/app/models/Mastering';
import { Skill } from 'src/app/models/Skill';
import { MasteringService } from '../../services/mastering.service';
import { UserService } from '../../services/user.service';

/*


Je ne suis pas parvenu à afficher les noms de familles et prénoms des users.
Une solution aurait été : 
    crée dans le model Mastering une méthode qui donnerait les identifiants des users
    On a un exemple de méthode dans la classe qui est skilltostring et categorytostring
*/
@Component({
    selector: 'app-session2-masterings',
    templateUrl: './session2-masterings.component.html',
    styleUrls: ['./session2-masterings.component.css']
})
export class Session2MasteringsComponent implements OnChanges {
    @Input() skill! : Skill ;
    @Output() newItemEvent = new EventEmitter<number>();
    listMasterings : Mastering[] = [];
    listLevel : String[];
//Beginner = 0, Intermediate = 1, Advanced = 2, Expert=3
    constructor(
        private MasteringService: MasteringService,
    ) {
        this.skill = new Skill();
        this.listLevel = ["Beginner", "Intermediate", "Advanced", "Expert"];
        console.log(this.listLevel);
    }

    ngInit(){

    }

    // Cet événement est appelé automatiquement par Angular à chaque fois que la valeur 
    // d'un paramètre d'entrée du composant est modifiée (voir https://angular.io/api/core/OnChanges).
    ngOnChanges(changes: SimpleChanges): void {
        for (const propName in changes) {
            const chng = changes[propName];
            const cur  = JSON.stringify(chng.currentValue);
            const prev = JSON.stringify(chng.previousValue);
            //this.changeLog.push(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
            console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);             
        }
        console.log("skill : ",this.skill);
        if(this.skill.skillId !== undefined){
            this.refresh();
            /*
            this.MasteringService.getAllBySkillid(this.skill.skillId!).subscribe(masterings =>{
                console.log("masterings : "+masterings);
                this.listMasterings = masterings;
                this.average();
            });
            */
        }

    }

    refresh(){
        this.MasteringService.getAllBySkillid(this.skill.skillId!).subscribe(masterings =>{
            console.log("masterings : "+masterings);
            this.listMasterings = masterings;
            this.average();
        });
    }

    names(userid : number){
        return "CHARLES EDOUARD";
    }

    changeLevel(value : any, id : number){
        //this.listLevel.indexOf(value);
        console.log(" index : "+this.listLevel.indexOf(value));
        console.log("Change level !", id);

        this.MasteringService.changeLevel(id,this.listLevel.indexOf(value)).subscribe(res =>{
            console.log("res change level : "+res);
            this.average();
            this.refresh();
        });
        
    }

    average(){

        var size = this.listMasterings.length;
        if(size != 0){
            var somme = 0;
            this.listMasterings.forEach(m =>{
                var index = this.listLevel.indexOf(m.level?.toString()!);
                somme += index;
            }); 
            var average =   somme/size;
            this.newItemEvent.emit(average);
        }else{
            var average = 0
            this.newItemEvent.emit(average);
        }
    }


}
