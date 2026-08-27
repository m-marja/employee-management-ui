import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Employees } from './employees/employees';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'employees', component: Employees, canActivate: [authGuard], },
];
