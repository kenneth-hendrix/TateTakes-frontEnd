import { Router } from '@angular/router';
import { AuthService } from './../../services/authentication.service';
import { Component, inject, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input({ required: true }) buttonType!: 'none' | 'login' | 'logout';

  private authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/feed']);
    }).catch(error => {
      console.error(error);
    });
  }

  login() {
    this.router.navigate(['/login']);
  }
}
