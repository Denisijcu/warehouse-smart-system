import { Component, inject, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { InventoryService } from '../../core/services/inventory.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="p-6 text-[#F0F1F5] font-sans">
      <div class="mb-6">
        <h1 class="text-xl font-bold">Reportes y Analíticas</h1>
        <p class="text-[10px] text-[#7C8196] uppercase tracking-wider">Análisis del Inventario y operaciones</p>
      </div>

      <div class="grid grid-cols-4 gap-4 mb-6">
        <div class="bg-[#151820] border border-[#252836] p-4 rounded-lg">
          <p class="text-[9px] text-[#7C8196] uppercase font-bold">Valor Total</p>
          <h2 class="text-2xl font-bold mt-1">{{ totalValue() | currency:'USD':'symbol':'1.0-0' }}</h2>
        </div>
        <div class="bg-[#151820] border border-[#252836] p-4 rounded-lg">
          <p class="text-[9px] text-[#7C8196] uppercase font-bold">Total Unidades</p>
          <h2 class="text-2xl font-bold mt-1 text-[#10B981]">{{ totalUnits() }}</h2>
        </div>
        <div class="bg-[#151820] border border-[#252836] p-4 rounded-lg">
          <p class="text-[9px] text-[#7C8196] uppercase font-bold">Productos Críticos</p>
          <h2 class="text-2xl font-bold mt-1 text-[#EF4444]">{{ criticalStockCount() }}</h2>
        </div>
        <div class="bg-[#151820] border border-[#252836] p-4 rounded-lg">
          <p class="text-[9px] text-[#7C8196] uppercase font-bold">Proveedores</p>
          <h2 class="text-2xl font-bold mt-1 text-[#A78BFA]">{{ inventoryService.suppliers().length }}</h2>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-6 mb-6">
        <div class="col-span-8 bg-[#151820] border border-[#252836] p-6 rounded-lg">
          <h3 class="text-xs font-bold mb-6">Valor por Pasillo</h3>
          <div class="space-y-4">
            @for (p of aisleData(); track p.name) {
              <div class="flex items-center gap-4">
                <span class="text-[10px] w-32 truncate">{{ p.name }}</span>
                <div class="flex-1 h-3 bg-[#0C0E14] rounded-full overflow-hidden">
                  <div class="h-full rounded-full" [style.width.%]="p.width" [style.background-color]="p.color"></div>
                </div>
                <span class="text-[10px] w-24 text-right font-bold">{{ p.val | currency:'USD':'symbol':'1.0-0' }}</span>
              </div>
            }
          </div>
        </div>

        <div class="col-span-4 bg-[#151820] border border-[#252836] p-6 rounded-lg flex flex-col items-center justify-center">
          <h3 class="text-xs font-bold w-full mb-4">Distribución de Unidades</h3>
          <div class="w-32 h-32 rounded-full border-[8px] border-t-[#FF6B00] border-r-[#10B981] border-b-[#A78BFA] border-l-[#06B6D4] flex items-center justify-center">
            <span class="font-bold text-xs">{{ totalUnits() }}</span>
          </div>
        </div>
      </div>

      <div class="bg-[#151820] border border-[#252836] rounded-lg p-6">
        <h3 class="text-xs font-bold mb-6">Top 10 Productos por Valor en Stock</h3>
        <table class="w-full text-left text-[10px] text-[#7C8196]">
          <thead>
            <tr class="uppercase border-b border-[#252836]">
              <th class="pb-3 font-bold">#</th>
              <th class="pb-3 font-bold">Producto</th>
              <th class="pb-3 font-bold">Precio</th>
              <th class="pb-3 font-bold">Stock</th>
              <th class="pb-3 font-bold">Valor Total</th>
            </tr>
          </thead>
          <tbody>
            @for (item of topProducts(); track item.id; let i = $index) {
              <tr class="border-b border-[#252836]/50 hover:bg-[#252836]/20">
                <td class="py-4">{{ i + 1 }}</td>
                <td class="py-4 text-[#F0F1F5] font-bold">{{ item.name }}</td>
                <td class="py-4">{{ item.price | currency }}</td>
                <td class="py-4">{{ item.quantity }}</td>
                <td class="py-4 font-bold text-[#FF6B00]">{{ (item.price * item.quantity) | currency }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ReportsComponent {
  inventoryService = inject(InventoryService);

  // Lógica de cálculo real
  totalValue = computed(() => this.inventoryService.products().reduce((acc, p) => acc + (p.price * p.quantity), 0));
  totalUnits = computed(() => this.inventoryService.products().reduce((acc, p) => acc + p.quantity, 0));
  criticalStockCount = computed(() => this.inventoryService.products().filter(p => p.quantity <= p.minStock).length);

  aisleData = computed(() => {
    const products = this.inventoryService.products();
    const total = this.totalValue();
    const grouped = products.reduce((acc: any, p: any) => {
      const id = p.targetAisleId || 'General';
      if (!acc[id]) acc[id] = { val: 0, name: `Pasillo ${id}` };
      acc[id].val += (p.price * p.quantity);
      return acc;
    }, {});

    return Object.values(grouped).map((item: any) => ({
      ...item,
      width: total > 0 ? (item.val / total) * 100 : 0,
      color: this.generateColor(item.name)
    }));
  });

  private generateColor(name: string): string {
    const colors = ['#EC4899', '#F59E0B', '#FF6B00', '#A78BFA', '#10B981', '#06B6D4'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  topProducts = computed(() => [...this.inventoryService.products()].sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity)).slice(0, 10));
}