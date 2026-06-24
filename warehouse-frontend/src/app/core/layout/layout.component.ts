import { Component, inject, signal, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <div class="flex h-screen bg-[#0C0E14] text-[#F0F1F5] font-sans overflow-hidden">
      
      <aside class="w-[260px] flex-shrink-0 bg-gradient-to-b from-[#0F1219] to-[#0C0E14] border-r border-[#252836] flex flex-col z-40">
        
        <div class="p-6 border-b border-[#252836]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br from-[#FF6B00] to-[#CC5500]">
              VC
            </div>
            <div>
              <div class="font-bold text-[#F0F1F5] text-base tracking-tight">Warehouse</div>
              <div class="text-[10px] text-[#7C8196] tracking-widest uppercase">Vertex Coders</div>
            </div>
          </div>
        </div>

        <nav class="flex flex-col gap-1 flex-1 py-4 px-3 overflow-y-auto custom-scrollbar">
          <!-- 🛡️ FILTRO POR ROL -->
          @for (item of filteredMenu(); track item.route) {
            <a [routerLink]="item.route" 
               routerLinkActive="!text-[#FF6B00] !bg-[#FF6B00]/10 !border-[#FF6B00]"
               class="flex items-center gap-3 p-3 rounded-lg text-[#7C8196] cursor-pointer transition-all duration-200 border-l-[3px] border-transparent font-medium hover:text-[#F0F1F5] hover:bg-[#FF6B00]/5">
              <span class="text-lg">{{item.icon}}</span>
              <span class="text-sm">{{item.label}}</span>
            </a>
          }
        </nav>

        <div class="p-4 border-t border-[#252836] mt-auto">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-[#FF6B00]/20 text-[#FF6B00]">
              👤
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-bold text-[#F0F1F5] truncate">{{ authService.currentUser()?.name || 'Usuario' }}</div>
              <div class="text-[10px] text-[#7C8196] uppercase">{{ authService.currentUser()?.role || 'Admin' }}</div>
            </div>
          </div>
          <button (click)="authService.logout()" 
                  class="w-full py-2.5 px-4 bg-transparent border border-[#252836] text-[#7C8196] rounded-lg text-sm font-medium hover:border-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all">
            🚪 Salir
          </button>
        </div>
      </aside>

      <div class="flex-1 flex flex-col relative overflow-hidden">
        
        <header class="h-[70px] min-h-[70px] bg-[#0F1219]/85 backdrop-blur-[20px] border-b border-[#252836] flex items-center justify-between px-8 z-30">
          <h2 class="text-lg font-medium text-[#F0F1F5]">
            Bienvenido, <span class="text-[#FF6B00]">{{ authService.currentUser()?.name || 'Usuario' }}</span> 👋
          </h2>
          <div class="flex items-center gap-4">
            </div>
        </header>

        <main class="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar">
          <div class="fixed top-[-200px] right-[-150px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,107,0,0.05)_0%,transparent_70%)] pointer-events-none -z-10"></div>
          
          <router-outlet></router-outlet>
        </main>

        <!-- <app-chat-widget></app-chat-widget> -->
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #252836; border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #FF6B00; }
  `]
})
export class LayoutComponent {
  authService = inject(AuthService);

  // 📌 Definición completa del menú (con roles permitidos)
  private fullMenu = [
    { route: '/dashboard', icon: '🏠', label: 'Dashboard', roles: ['admin', 'operator'] },
    { route: '/pasillos', icon: '🛣️', label: 'Pasillos', roles: ['admin', 'operator'] },
    { route: '/usuarios', icon: '👥', label: 'Usuarios', roles: ['admin'] },
    { route: '/inventory', icon: '📦', label: 'Inventario', roles: ['admin', 'operator','guest'] },
    { route: '/movements', icon: '🔄', label: 'Movimientos', roles: ['admin', 'operator'] },
    { route: '/suppliers', icon: '🤝', label: 'Proveedores', roles: ['admin', 'operator'] },
    { route: '/reports', icon: '📊', label: 'Reportes', roles: ['admin', 'operator'] },
    { route: '/ai-asistente', icon: '🤖', label: 'Asistente AI', roles: ['admin', 'operator', 'guest'] },
    { route: '/alertas', icon: '🔔', label: 'Alertas', roles: ['admin', 'operator'] },
    { route: '/configuracion', icon: '⚙️', label: 'Configuración', roles: ['admin'] },
   // { route: '/store', icon: '🛒', label: 'Tienda', roles: ['admin', 'operator', 'guest'] },
   // { route: '/categories', icon: '🏷️', label: 'Categorías', roles: ['admin', 'operator', 'guest'] },
  ];

  // 🛡️ Menú filtrado según el rol del usuario actual
  filteredMenu = computed(() => {
    const user = this.authService.currentUser();
    const role = user?.role || 'guest';
    
    // Filtrar solo los ítems que el rol puede ver
    return this.fullMenu.filter(item => item.roles.includes(role));
  });
}