import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutes } from '../routing/app.routing';

import { AppComponent } from '../components/app/app.component';
import { NavMenuComponent } from '../components/nav-menu/nav-menu.component';
import { HomeComponent } from '../components/home/home.component';
import { UserListComponent } from '../components/userlist/userlist.component';
import { CVComponent } from '../components/CV/CV.component';
import { TitleComponent } from '../components/CV/title/title.component';
//import { RestrictedComponent } from '../components/restricted/restricted.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { JwtInterceptor } from '../interceptors/jwt.interceptor';
import { LoginComponent } from '../components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


 

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
        UnknownComponent,
        //RestrictedComponent,
        CVComponent,
        TitleComponent,
       
        
        
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
            { path: '', component: HomeComponent, pathMatch: 'full' },
            { path: 'team', component: UserListComponent },
            { path: 'CV', component: CVComponent },
            { path: 'login', component: LoginComponent}
            
            
        ]),
        BrowserAnimationsModule
    ],
    providers: [
        { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
        { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
