import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../core/services/inventory.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 text-[#F0F1F5] font-sans">
      <div class="flex justify-between items-end mb-8">
        <div>
          <h1 class="text-2xl font-bold">Centro de Alertas</h1>
          <p class="text-xs text-[#7C8196] mt-1">{{ alerts().length }} alertas · {{ unreadCount() }} sin leer</p>
        </div>
        @if (unreadCount() > 0) {
          <button (click)="markAllAsRead()" class="text-[10px] uppercase font-bold text-[#FF6B00] hover:underline">
            Marcar todas como leídas
          </button>
        }
      </div>

      <div class="space-y-3">
        @for (alert of alerts(); track alert.id) {
          <div class="bg-[#151820] border-l-4 border-[#EF4444] p-4 rounded-lg flex items-start gap-4 hover:bg-[#1C1F2B] transition-colors relative">
            <div class="mt-1">
              <i class="fas fa-exclamation-circle text-[#EF4444]"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-bold text-[#F0F1F5]">Stock bajo: {{ alert.productName }}</h3>
              <p class="text-[10px] text-[#7C8196] mt-0.5">Quedan {{ alert.quantity }} unidades. Mínimo requerido: {{ alert.minStock }}</p>
              <p class="text-[9px] text-[#7C8196] mt-2 font-mono">{{ alert.date | date:'yyyy-MM-dd' }}</p>
            </div>
            @if (!alert.read) {
              <div class="w-2 h-2 rounded-full bg-[#FF6B00]"></div>
            }
          </div>
        } @empty {
          <div class="py-20 text-center text-[#7C8196]">
            <i class="fas fa-check-circle text-4xl opacity-20 mb-4 block"></i>
            <p>Todo en orden. No hay alertas pendientes.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class AlertsComponent {
  inventoryService = inject(InventoryService);

  // Computamos las alertas dinámicamente basadas en el inventario real
  alerts = computed(() => {
    return this.inventoryService.products()
      .filter(p => p.quantity <= p.minStock)
      .map(p => ({
        id: p.id,
        productName: p.name,
        quantity: p.quantity,
        minStock: p.minStock,
        date: new Date(), // En producción, esto vendría del log de sistema
        read: false
      }));
  });

  unreadCount = computed(() => this.alerts().filter(a => !a.read).length);

  markAllAsRead() {
    // Lógica para actualizar estado en el servicio
    console.log('Marcando todas como leídas...');
  }
}