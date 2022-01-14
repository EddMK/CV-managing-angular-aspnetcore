import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MAT_DATE_LOCALE} from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutes } from '../routing/app.routing';

import { AppComponent } from '../components/app/app.component';
import { NavMenuComponent } from '../components/nav-menu/nav-menu.component';
import { HomeComponent } from '../components/home/home.component';
import { UserListComponent } from '../components/userlist/userlist.component';
import { CVComponent } from '../components/CV/CV.component';
import { TitleComponent } from '../components/title/title.component';
import { SkillListComponent } from '../components/skill-list/skill-list.component';
import { EnterpriseListComponent} from '../components/enterprise-list/enterprise-list.component';
//import { RestrictedComponent } from '../components/restricted/restricted.component';
import {EditSkillComponent} from '../components/edit-skill/edit-skill.component';
import {EditEnterpriseComponent} from '../components/edit-enterprise/edit-enterprise.component';
import {EditExperienceComponent } from '../components/edit-experience/edit-experience.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { JwtInterceptor } from '../interceptors/jwt.interceptor';
import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule} from './shared.module';
import { SkillsComponent } from '../components/skills/skills.component';
import { UsinglistComponent } from '../components/usinglist/usinglist.component';
import { ExperiencesComponent } from '../components/experiences/experiences.component';

import { EditTitleComponent } from '../components/edit-title/edit-title.component';
import { EditCompetencesListComponent } from '../components/edit-competences-list/edit-competences-list.component';
import { EditCompetenceComponent } from '../components/edit-competence/edit-competence.component';
import { ConfirmComponent } from '../components/confirm/confirm.component';
import { AddMastering } from '../components/app/add-mastering/add-mastering.component';





export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        UserListComponent,
        LoginComponent,
        SignupComponent,
        UnknownComponent,
        //RestrictedComponent,
        CVComponent,
    
        TitleComponent,
        SkillsComponent,
        ExperiencesComponent,
        UsinglistComponent,
        EditSkillComponent,
        EditExperienceComponent,
        EditEnterpriseComponent,
        SkillListComponent,
        EnterpriseListComponent,
        EditCompetencesListComponent,
        EditCompetenceComponent,
        EditTitleComponent,
        ConfirmComponent,
        AddMastering
       
    
        
    ],
    entryComponents: [
       
    ],
    
    imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        HttpClientModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
            { path: '', component: HomeComponent, pathMatch: 'full' },
            { path: 'team', component: UserListComponent },
            { path: 'CV', component: CVComponent },
            { path: 'login', component: LoginComponent},
            { path: 'signup', component: SignupComponent},
            { path: 'skill-list', component: SkillListComponent},
            { path: 'enterprise-list', component : EnterpriseListComponent}
        ]),
        BrowserAnimationsModule
    ],
    providers: [
        { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
        { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
