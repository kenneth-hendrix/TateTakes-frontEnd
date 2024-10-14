import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard.guard';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { FeedComponent } from './components/feed/feed.component';
import { DeathThreatsComponent } from './components/death-threats/death-threats.component';

export const routes: Routes = [
  { path: '', redirectTo: '/feed', pathMatch: 'full' },
  {path: 'feed', component: FeedComponent},
  { path: 'login', component: LoginComponent },
  { path: 'deathTreats', component: DeathThreatsComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
  },
];
