import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authentication.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    this.errorMessage = '';
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService
        .login(email, password)
        .then(() => {
          this.router.navigate(['/admin']);
        })
        .catch((error) => {
          this.errorMessage = error.message;
        });
    }
  }
}
