import { Router } from '@angular/router';
import { AuthService } from './../../services/authentication.service';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() hideButtons: boolean = false;
  @Input() hideAdmin: boolean = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  isAuthenticated: boolean = false;

  private $destroy = new Subject<void>();

  ngOnInit(): void {
    this.authService.isAuthenticated
      .pipe(takeUntil(this.$destroy))
      .subscribe((value) => {
        if (value) {
          this.isAuthenticated = true;
        } else {
          this.isAuthenticated = false;
        }
      });
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
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        this.toastr.error('Please try again later', 'Something went wrong');
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
