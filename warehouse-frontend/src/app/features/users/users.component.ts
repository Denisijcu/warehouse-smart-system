import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 text-[#F0F1F5]">
      <h1 class="text-2xl font-bold mb-4">👤 Gestión de Usuarios</h1>
      <button class="bg-[#10B981] px-4 py-2 rounded-lg text-xs font-bold mb-4" (click)="openCreateModal()">+ Crear Usuario</button>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (user of users(); track user.id) {
          <div class="bg-[#151820] border border-[#252836] rounded-xl p-4">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-bold">{{ user.name }}</h3>
                <p class="text-xs text-[#7C8196]">{{ user.email }}</p>
                <span class="text-[10px] px-2 py-0.5 rounded" 
                      [ngClass]="{
                        'bg-[#FF6B00]/20 text-[#FF6B00]': user.role === 'admin',
                        'bg-[#10B981]/20 text-[#10B981]': user.role === 'operator',
                        'bg-[#7C8196]/20 text-[#7C8196]': user.role === 'guest'
                      }">
                  {{ user.role | uppercase }}
                </span>
              </div>
              <div class="flex gap-2">
                <button class="text-[#FF6B00] text-xs" (click)="openEditModal(user)">✏️</button>
                <button class="text-[#EF4444] text-xs" (click)="deleteUser(user.id)">🗑️</button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Modal Crear/Editar Usuario -->
      @if (showModal()) {
        <div class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-[#151820] border border-[#252836] rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 class="font-bold text-lg text-[#F0F1F5] mb-4">{{ editingId() ? 'Editar Usuario' : 'Crear Usuario' }}</h3>
            <div class="space-y-3">
              <input [(ngModel)]="formData.name" placeholder="Nombre" class="w-full bg-[#0C0E14] border border-[#252836] rounded-lg p-3 text-sm text-[#F0F1F5] focus:border-[#FF6B00] outline-none placeholder:text-[#7C8196]">
              <input [(ngModel)]="formData.email" placeholder="Email" class="w-full bg-[#0C0E14] border border-[#252836] rounded-lg p-3 text-sm text-[#F0F1F5] focus:border-[#FF6B00] outline-none placeholder:text-[#7C8196]">
              <input [(ngModel)]="formData.password" type="password" placeholder="Contraseña" class="w-full bg-[#0C0E14] border border-[#252836] rounded-lg p-3 text-sm text-[#F0F1F5] focus:border-[#FF6B00] outline-none placeholder:text-[#7C8196]">
              <select [(ngModel)]="formData.role" class="w-full bg-[#0C0E14] border border-[#252836] rounded-lg p-3 text-sm text-[#F0F1F5] focus:border-[#FF6B00] outline-none">
                <option value="admin">Admin</option>
                <option value="operator">Operador</option>
                <option value="guest">Invitado (Solo tienda)</option>
              </select>
            </div>
            <div class="flex gap-3 mt-6">
              <button class="flex-1 py-2.5 border border-[#252836] rounded-lg text-[#7C8196] hover:bg-[#252836] transition-colors" (click)="closeModal()">Cancelar</button>
              <button class="flex-1 py-2.5 bg-[#10B981] hover:bg-[#059669] rounded-lg text-white font-bold transition-colors" (click)="saveUser()">Guardar</button>
            </div>
          </div>
        </div>
      }
  `
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  users = signal<any[]>([]);
  showModal = signal(false);
  editingId = signal<string | null>(null);
  formData = { name: '', email: '', password: '', role: 'guest' };

  ngOnInit() { this.loadUsers(); }

  loadUsers() { this.userService.getUsers().subscribe(data => this.users.set(data)); }

  openCreateModal() {
    this.formData = { name: '', email: '', password: '', role: 'guest' };
    this.editingId.set(null);
    this.showModal.set(true);
  }

  openEditModal(user: any) {
    this.formData = { ...user, password: '' };
    this.editingId.set(user.id);
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  saveUser() {
    const data = this.formData;
    const obs = this.editingId()
      ? this.userService.updateUser(this.editingId()!, data)
      : this.userService.createUser(data);
    obs.subscribe(() => { this.loadUsers(); this.closeModal(); });
  }

  deleteUser(id: string) {
    if (!confirm('¿Eliminar este usuario?')) return;
    this.userService.deleteUser(id).subscribe(() => this.loadUsers());
  }
}