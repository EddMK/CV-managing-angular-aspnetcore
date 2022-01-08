import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormGroup, NumberValueAccessor } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import { User,  Role } from 'src/app/models/User';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Level, Mastering } from 'src/app/models/Mastering';
import { MasteringService } from 'src/app/services/mastering.service';
import { UsingService } from 'src/app/services/using.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditCompetencesListComponent } from '../edit-competences-list/edit-competences-list.component';


@Component({
    selector: 'app-edit-competence-mat',
    templateUrl: './edit-competence.component.html',
   
})
export class EditCompetenceComponent implements OnChanges{
    public frm!: FormGroup;
    public ctlSkill!: FormControl;
    public ctlCategory!: FormControl;
    public ctlLevel!: FormControl;
    public id: any;
    public selected: number;
  


    @Input() public mastering! : Mastering;
    @Output() public newRefreshEvent = new EventEmitter<number>();


    $emit: any;
  
 

    constructor(
        private fb: FormBuilder,
        private masteringService: MasteringService,
        
    ) {
        
        this.ctlSkill = this.fb.control(null, [Validators.minLength(3)]);
        this.ctlCategory = this.fb.control(null, [Validators.minLength(3)]);
        this.ctlLevel = this.fb.control(this.mastering?.levelValue!, []);
        this.selected = this.mastering?.level!;
     
    
        this.frm = this.fb.group({
            
            level: this.ctlLevel,
            
        });
       
        this.frm.patchValue(this.mastering);
        
       
    }

    // Validateur bidon qui vérifie que la valeur est différente
    forbiddenValue(val: string): any {
        return (ctl: FormControl) => {
            if (ctl.value === val) {
                return { forbiddenValue: { currentValue: ctl.value, forbiddenValue: val } };
            }
            return null;
        };
    }

    delete(mastering: Mastering){
        this.masteringService.delete(mastering).subscribe(res =>{
           //this.refresh(mastering?.userId!);
           this.refreshParent(mastering);
        })
    }

    save(mastering: Mastering){
        console.log(this.selected)
       
        this.masteringService.save(mastering, this.selected).subscribe(res =>{
           // this.refresh(mastering?.userId!);
           console.log(this.frm.value);
           this.refreshParent(mastering);
        });
    }

    create(){
      
    }

    refresh(id: number) {
       
        
    }

    refreshParent(mastering : Mastering){
        this.newRefreshEvent.emit(mastering.userId);
    }
   

    ngOnChanges() {}


}
