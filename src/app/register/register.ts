import { Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { AuthService } from '../services/auth.service.ts';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormField, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  private readonly authService = inject(AuthService);

  private readonly router = inject(Router)

  readonly registerModel = signal({ email: '', password: '', confirmPassword: '' });
  readonly registerForm = form(this.registerModel);

  readonly errorMessage = signal("");
  readonly isLoading = signal(false);

  onRegister(): void {

    const { email, password, confirmPassword } = this.registerModel();

    if (!email || !password || !confirmPassword) {
      this.errorMessage.set("Email and password are required.");
      return;
    }

    if (password !== confirmPassword) {
      this.errorMessage.set("Passwords do not match.");
      return;
    }

    this.errorMessage.set("");
    this.isLoading.set(true);

    this.authService.register(email, password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigateByUrl("/login");
      },
      error: (error) => {
        this.isLoading.set(false);

        this.errorMessage.set(error.error?.message || "Registration failed. please try again")
      }
    })

  }
}
