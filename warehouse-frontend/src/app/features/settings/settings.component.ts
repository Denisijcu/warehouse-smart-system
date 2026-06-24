import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 text-[#F0F1F5] font-sans max-w-4xl">
      <h1 class="text-2xl font-bold mb-6">Configuración del Sistema</h1>
      
      <div class="bg-[#151820] p-6 rounded-xl border border-[#252836] mb-6">
        <h2 class="text-sm font-bold text-[#FF6B00] uppercase mb-4 tracking-wider">Perfil de Usuario</h2>
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-[10px] text-[#7C8196] uppercase mb-2">Nombre Completo</label>
            <input type="text" [value]="authService.currentUser()?.name" class="w-full bg-[#0C0E14] border border-[#252836] rounded-lg p-3 text-sm focus:border-[#FF6B00] outline-none">
          </div>
          <div>
            <label class="block text-[10px] text-[#7C8196] uppercase mb-2">Rol</label>
            <input type="text" [value]="authService.currentUser()?.role" disabled class="w-full bg-[#0C0E14] border border-[#252836] rounded-lg p-3 text-sm text-[#7C8196] cursor-not-allowed">
          </div>
        </div>
      </div>

      <div class="bg-[#151820] p-6 rounded-xl border border-[#252836]">
        <h2 class="text-sm font-bold text-[#FF6B00] uppercase mb-4 tracking-wider">Conectividad & IA</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium">Modo de Operación Local</p>
              <p class="text-[10px] text-[#7C8196]">Mantener procesamiento de IA dentro de la red local</p>
            </div>
            <input type="checkbox" checked class="accent-[#FF6B00]">
          </div>
          <div class="border-t border-[#252836] pt-4">
            <label class="block text-[10px] text-[#7C8196] uppercase mb-2">Endpoint de API OracleAI</label>
            <input type="text" value="https://api.vertexcoders.local/v1" class="w-full bg-[#0C0E14] border border-[#252836] rounded-lg p-3 text-sm font-mono text-[#FF6B00] outline-none">
          </div>
        </div>
      </div>

      <div class="mt-8 flex justify-end">
        <button class="bg-[#FF6B00] hover:bg-[#CC5500] text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all">
          Guardar Cambios
        </button>
      </div>
    </div>
  `
})
export class SettingsComponent {
  authService = inject(AuthService);
}