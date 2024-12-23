import { Routes } from '@angular/router';
import { AuthGuard } from '@angular/fire/auth-guard';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { FeedComponent } from './components/feed/feed.component';
import { DeathThreatsComponent } from './components/death-threats/death-threats.component';
import { SubscribeComponent } from './components/subscribe/subscribe.component';
import { ExpandedPostComponent } from './components/post/expanded-post/expanded-post.component';
import { redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToFeed = () => redirectUnauthorizedTo(['/feed']);

export const routes: Routes = [
  { path: '', redirectTo: '/feed', pathMatch: 'full' },
  { path: 'feed', component: FeedComponent },
  { path: 'login', component: LoginComponent },
  { path: 'deathThreats', component: DeathThreatsComponent },
  { path: 'subscribe', component: SubscribeComponent },
  { path: 'post/:postId/:index', component: ExpandedPostComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToFeed },
  },
  { path: '**', component: FeedComponent },
];
