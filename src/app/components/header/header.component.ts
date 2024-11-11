import { Router } from '@angular/router';
import { AuthService } from './../../services/authentication.service';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

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
  @Input() hideThreats: boolean = false;
  @Output() onGoHome = new EventEmitter<void>();

  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);

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
    this.spinner.show();
    this.authService
      .logout()
      .then(() => {
        this.spinner.hide();
        this.router.navigate(['/feed']);
        window.location.reload();
      })
      .catch((error) => {
        this.spinner.hide();
        console.error(error);
        this.toastr.error('Please try again later', 'Something went wrong');
      });
  }

  login() {
    this.router.navigate(['/login']);
  }

  subscribe() {
    this.router.navigate(['/subscribe']);
  }

  goHome() {
    this.onGoHome.emit();
    this.router.navigate(['/feed']);
  }

  admin() {
    this.router.navigate(['/admin']);
  }

  threaten() {
    this.router.navigate(['/deathThreats']);
  }
}
