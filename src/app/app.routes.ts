import { Routes } from '@angular/router';
import { AuthorizeComponent } from './auth/authorize/authorize.component';
import { HomeComponent } from './dashboard/home/home.component';

export const routes: Routes = [
  { path: '', component: AuthorizeComponent },
  { path: 'dashboard', component: HomeComponent },
];
