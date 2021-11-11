import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '../components/home/home.component';
import { UserListComponent } from '../components/userlist/userlist.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'team', component: UserListComponent },
  { path: '**', redirectTo: '' }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
