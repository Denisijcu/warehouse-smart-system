import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="card p-4 shadow" style="max-width: 400px; margin: 5rem auto;">
        <h2 class="text-center mb-4">Iniciar Sesión</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" [(ngModel)]="email" name="email" class="form-control" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Contraseña</label>
            <input type="password" [(ngModel)]="password" name="password" class="form-control" required>
          </div>
          <button type="submit" class="btn btn-primary w-100" [disabled]="loading">
            {{ loading ? 'Cargando...' : 'Entrar' }}
          </button>
        </form>
        <div *ngIf="error" class="alert alert-danger mt-3">{{ error }}</div>
      </div>
    </div>
  `,
  styles: [`
    .login-container { min-height: 100vh; background: #f5f5f5; display: flex; align-items: center; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/inventory']);
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al iniciar sesión';
        this.loading = false;
      }
    });
  }
}