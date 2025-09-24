import { Routes } from '@angular/router';
import { AuthorizeComponent } from './modules/auth/authorize/authorize.component';
import { HomeComponent } from './modules/dashboard/home/home.component';

export const routes: Routes = [
  { path: '', component: AuthorizeComponent },
  { path: 'dashboard', component: HomeComponent },
];
