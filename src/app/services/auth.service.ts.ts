import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";
import { environment } from "../../environments/environment";

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly authUrl = `${environment.apiUrl}/auth`;

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.authUrl}/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem("access_token", response.token);
        })
      );
  }

  logout(): void {
    localStorage.removeItem("access_token");
  }

  isLoggedIn(): boolean {
    return Boolean(localStorage.getItem("access_token"));
  }
}