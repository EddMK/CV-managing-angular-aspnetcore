import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ConfirmData } from "src/app/models/Confirm-data";


@Component({
    selector: 'app-confirm', // sélecteur utilisé pour un sous-composant
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.css']
})

export class ConfirmComponent implements OnInit {

   constructor(@Inject(MAT_DIALOG_DATA) public data : ConfirmData){

   }
    ngOnInit(): void {
        
    }

   
}