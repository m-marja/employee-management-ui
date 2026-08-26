import { Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { AuthService } from '../services/auth.service.ts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormField],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private readonly authService = inject(AuthService);

  private readonly router = inject(Router)

  readonly loginModel = signal({ email: '', password: '' });
  readonly loginForm = form(this.loginModel);

  readonly errorMessage = signal("");
  readonly isLoading = signal(false);

  onLogin(): void {

    const { email, password } = this.loginModel();

    if (!email || !password) {
      this.errorMessage.set("Email and password are required.");
      return;
    }

    this.errorMessage.set("");
    this.isLoading.set(true);

    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigateByUrl("/employees");
      },
      error: (error) => {
        this.isLoading.set(false);

        this.errorMessage.set(error.error?.message || "login faled. please try again")
      }
    })

  }
}
