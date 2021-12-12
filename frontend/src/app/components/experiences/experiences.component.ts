import { Component, OnInit } from '@angular/core';

import { CVComponent } from '../CV/CV.component';
import { TitleComponent } from '../title/title.component';


@Component({
  selector: 'app-experiences',
  templateUrl: './experiences.component.html',
  styles: [
  ]
})
export class ExperiencesComponent extends CVComponent implements OnInit {
  

  ngOnInit(): void {
    
  }



}
