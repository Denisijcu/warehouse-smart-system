import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';          // <--- Importación corregida
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://warehouse-smart-system-production.up.railway.app/api/auth';
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromToken();
  }

  login(email: string, password: string): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(response => {
        localStorage.setItem('token', response.token);
        this.currentUser.set(response.user);
      }));
  }

  register(name: string, email: string, password: string, role: 'admin' | 'operator' = 'operator'): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, { name, email, password, role });
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private loadUserFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);   // <--- Uso corregido
        this.currentUser.set({
          id: decoded.id,
          email: decoded.email,
          role: decoded.role
        } as User);
      } catch {
        this.logout();
      }
    }
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }
}