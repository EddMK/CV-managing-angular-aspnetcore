import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '../components/home/home.component';
import { UserListComponent } from '../components/userlist/userlist.component';
import { RestrictedComponent } from '../modules/restricted/restricted.component';
import { LoginComponent } from '../components/login/login.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { AuthGuard } from '../services/auth.guard';
import { CVComponent } from '../components/CV/CV.component';
import { Role } from '../models/User';


const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  /*{ path: 'team', component: UserListComponent },
  { path: '**', redirectTo: '' }*/
  {
    path: 'team',
    component: UserListComponent,
    canActivate: [AuthGuard],
    //data: { roles: [Role.Manager] }
},
{
  path: 'CV',
  component: CVComponent
},
{
    path: 'login',
    component: LoginComponent
},
{ path: 'restricted', component: RestrictedComponent },
{ path: '**', component: UnknownComponent }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
