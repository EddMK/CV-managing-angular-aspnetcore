import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from '../components/app/app.component';
import { NavMenuComponent } from '../components/nav-menu/nav-menu.component';
import { HomeComponent } from '../components/home/home.component';
import { UserListComponent } from '../components/userlist/userlist.component';

 

export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        UserListComponent,
        
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        HttpClientModule,
        FormsModule,
        RouterModule.forRoot([
            { path: '', component: HomeComponent, pathMatch: 'full' },
            
        ])
    ],
    providers: [
        { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
