import { Component, OnInit } from '@angular/core';

import { CVComponent } from '../CV.component';




@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styles: [
  ]
})
export class TitleComponent extends CVComponent  implements OnInit {
  

  

  ngOnInit(): void {
    
  }



}
