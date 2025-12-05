import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }

  register(data: { name: string; email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/auth/register`, data, {
      withCredentials: true
    });
  }

  login(data: { email: string; password: string }) {
    return this.http
      .post<{ user: User }>(`${this.apiUrl}/auth/login`, data, {
        withCredentials: true
      })
      .pipe(
        tap((res) => {
          this.currentUserSubject.next(res.user);
        })
      );
  }

  logout() {
    return this.http
      .post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.currentUserSubject.next(null);
        })
      );
  }

  fetchProfile() {
    return this.http
      .get<{ user: User }>(`${this.apiUrl}/profile`, {
        withCredentials: true
      })
      .pipe(
        tap((res) => {
          this.currentUserSubject.next(res.user);
        })
      );
  }
}
