import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { ConfirmComponent } from "../components/confirm/confirm.component";
import { ConfirmData } from "../models/Confirm-data";

@Injectable({
    providedIn: 'root'
})

export class ConfirmService {
   
    constructor(private dialog : MatDialog){}

    confirmDialog(data: ConfirmData) : Observable<Boolean>{
        return this.dialog.open(ConfirmComponent, {
           data
           ,width: '400px',
           disableClose: true
        }).afterClosed();
    }
    

}