import { Routes } from '@angular/router';
import { RedirectComponent } from './components/epic-initializer/redirect/redirect.component';
import { HomeComponent } from './components/epic-initializer/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'redirect', component: RedirectComponent },
];
