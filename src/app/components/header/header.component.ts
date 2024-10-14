import { FeedService } from './../../services/feed.service';
import { Router } from '@angular/router';
import { AuthService } from './../../services/authentication.service';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input({ required: true }) buttonType!: 'none' | 'login' | 'logout';
  @Input() showAdmin: boolean = true;

  private authService = inject(AuthService);
  private router = inject(Router);

  showAuth: boolean = false;

  private $destroy = new Subject<void>();

  ngOnInit(): void {
    this.authService.isAuthenticated.pipe(
      takeUntil(this.$destroy)
    ).subscribe(
      (value) => {
        if (value) {
          this.showAuth = this.showAdmin;
        } else {
          this.showAuth = false;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  logout() {
    this.authService
      .logout()
      .then(() => {
        this.router.navigate(['/feed']);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  login() {
    this.router.navigate(['/login']);
  }

  goHome() {
    this.router.navigate(['/feed']);
  }

  admin() {
    this.router.navigate(['/admin']);
  }
}
