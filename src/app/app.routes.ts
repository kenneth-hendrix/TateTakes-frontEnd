import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard.guard';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { FeedComponent } from './components/feed/feed.component';
import { DeathThreatsComponent } from './components/death-threats/death-threats.component';
import { SubscribeComponent } from './components/subscribe/subscribe.component';

export const routes: Routes = [
  { path: '', redirectTo: '/feed', pathMatch: 'full' },
  { path: 'feed', component: FeedComponent },
  { path: 'login', component: LoginComponent },
  { path: 'deathThreats', component: DeathThreatsComponent },
  { path: 'subscribe', component: SubscribeComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
  },
];
