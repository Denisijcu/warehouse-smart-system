import { Component, inject, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { InventoryService } from '../../core/services/inventory.service';
// Si tienes un servicio separado para movimientos, inyéctalo. Por ahora usaré el inventory como ejemplo.

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  template: `
    <div class="mb-8 flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 class="font-sans text-2xl font-bold text-[#F0F1F5]">Panel de Control</h1>
        <p class="text-sm text-[#7C8196] mt-1">Resumen en tiempo real del almacén</p>
      </div>
      <div class="text-sm text-[#7C8196] bg-[#151820] px-4 py-2 rounded-lg border border-[#252836]">
        <i class="fas fa-clock mr-2 text-[#FF6B00]"></i>Última actualización: {{ currentDate | date:'shortTime' }}
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
      
      <div class="bg-[#151820] border border-[#252836] rounded-xl p-5 hover:border-[#FF6B00]/30 hover:-translate-y-1 transition-all duration-300">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center text-[#FF6B00] bg-[#FF6B00]/10 mb-3 text-lg">
          <i class="fas fa-box"></i>
        </div>
        <div class="text-3xl font-bold text-[#F0F1F5]">{{ totalProducts() }}</div>
        <div class="text-xs text-[#7C8196] mt-1 uppercase tracking-wider">Productos</div>
      </div>

      <div class="bg-[#151820] border border-[#252836] rounded-xl p-5 hover:border-[#10B981]/30 hover:-translate-y-1 transition-all duration-300">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center text-[#10B981] bg-[#10B981]/10 mb-3 text-lg">
          <i class="fas fa-cubes-stacked"></i>
        </div>
        <div class="text-3xl font-bold text-[#F0F1F5]">{{ totalStock() | number }}</div>
        <div class="text-xs text-[#7C8196] mt-1 uppercase tracking-wider">Unidades en stock</div>
      </div>

      <div class="bg-[#151820] border border-[#252836] rounded-xl p-5 hover:border-[#EF4444]/30 hover:-translate-y-1 transition-all duration-300">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center text-[#EF4444] bg-[#EF4444]/10 mb-3 text-lg">
          <i class="fas fa-triangle-exclamation"></i>
        </div>
        <div class="text-3xl font-bold text-[#EF4444]">{{ lowStockCount() }}</div>
        <div class="text-xs text-[#7C8196] mt-1 uppercase tracking-wider">Stock crítico</div>
      </div>

      <div class="bg-[#151820] border border-[#252836] rounded-xl p-5 hover:border-[#10B981]/30 hover:-translate-y-1 transition-all duration-300">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center text-[#10B981] bg-[#10B981]/10 mb-3 text-lg">
          <i class="fas fa-arrow-down"></i>
        </div>
        <div class="text-3xl font-bold text-[#F0F1F5]">24</div>
        <div class="text-xs text-[#7C8196] mt-1 uppercase tracking-wider">Entradas hoy</div>
      </div>

      <div class="bg-[#151820] border border-[#252836] rounded-xl p-5 lg:col-span-1 col-span-2 hover:border-[#F59E0B]/30 hover:-translate-y-1 transition-all duration-300">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center text-[#F59E0B] bg-[#F59E0B]/10 mb-3 text-lg">
          <i class="fas fa-dollar-sign"></i>
        </div>
        <div class="text-2xl font-bold text-[#F0F1F5]">{{ totalValue() | currency:'USD':'symbol':'1.0-0' }}</div>
        <div class="text-xs text-[#7C8196] mt-1 uppercase tracking-wider">Valor del inventario</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      
      <div class="bg-[#151820] border border-[#252836] rounded-xl p-6 lg:col-span-2">
        <h3 class="font-semibold text-[#F0F1F5] text-lg mb-1">Actividad Reciente</h3>
        <p class="text-xs text-[#7C8196] mb-5">Últimos movimientos registrados en el almacén</p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr>
                <th class="p-3 text-xs uppercase tracking-wider text-[#7C8196] border-b border-[#252836] font-semibold">Tipo</th>
                <th class="p-3 text-xs uppercase tracking-wider text-[#7C8196] border-b border-[#252836] font-semibold">Producto</th>
                <th class="p-3 text-xs uppercase tracking-wider text-[#7C8196] border-b border-[#252836] font-semibold">Cant.</th>
                <th class="p-3 text-xs uppercase tracking-wider text-[#7C8196] border-b border-[#252836] font-semibold">Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-[#FF6B00]/5 transition-colors border-b border-[#252836]/50">
                <td class="p-3">
                  <span class="inline-flex items-center px-2 py-1 rounded bg-[#EF4444]/10 text-[#EF4444] text-[10px] font-bold uppercase tracking-wider">Salida</span>
                </td>
                <td class="p-3 text-sm font-medium text-[#F0F1F5]">Bolsa de Cemento 50kg</td>
                <td class="p-3 text-sm text-[#F0F1F5]">1</td>
                <td class="p-3 text-xs text-[#7C8196]">Hoy, 07:23 AM</td>
              </tr>
              <tr class="hover:bg-[#FF6B00]/5 transition-colors border-b border-[#252836]/50">
                <td class="p-3">
                  <span class="inline-flex items-center px-2 py-1 rounded bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold uppercase tracking-wider">Entrada</span>
                </td>
                <td class="p-3 text-sm font-medium text-[#F0F1F5]">Martillo 16oz</td>
                <td class="p-3 text-sm text-[#F0F1F5]">5</td>
                <td class="p-3 text-xs text-[#7C8196]">Ayer, 02:17 PM</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-[#151820] border border-[#252836] rounded-xl p-6">
        <h3 class="font-semibold text-[#F0F1F5] text-lg mb-1">Top Valor en Stock</h3>
        <p class="text-xs text-[#7C8196] mb-5">Productos con mayor capital inmovilizado</p>
        
        <div class="space-y-4">
          @for (product of topValuedProducts(); track product.id) {
            <div>
              <div class="flex justify-between text-sm mb-1.5">
                <span class="text-[#F0F1F5] truncate mr-2">{{ product.name }}</span>
                <span class="text-[#FF6B00] font-bold flex-shrink-0">{{ (product.price * product.quantity) | currency:'USD':'symbol':'1.0-0' }}</span>
              </div>
              <div class="h-1.5 rounded-full bg-[#252836] overflow-hidden">
                <div class="h-full rounded-full bg-[#FF6B00]" [style.width.%]="(product.price * product.quantity) / maxProductValue() * 100"></div>
              </div>
            </div>
          }
        </div>
      </div>

    </div>
  `
})
export class DashboardComponent {
  inventoryService = inject(InventoryService);
  currentDate = new Date();

  // 🛡️ Motores Computados (Signals): Sustituyen a las viejas variables globales de tu monolito
  
  totalProducts = computed(() => this.inventoryService.products().length);
  
  totalStock = computed(() => 
    this.inventoryService.products().reduce((sum, p) => sum + p.quantity, 0)
  );
  
  lowStockCount = computed(() => 
    this.inventoryService.products().filter(p => p.quantity <= p.minStock).length
  );
  
  totalValue = computed(() => 
    this.inventoryService.products().reduce((sum, p) => sum + (p.price * p.quantity), 0)
  );

  // Calcula los 4 productos con mayor valor total (precio * cantidad)
  topValuedProducts = computed(() => {
    return [...this.inventoryService.products()]
      .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
      .slice(0, 4);
  });

  // Utilidad para calcular el porcentaje de la barra de progreso
  maxProductValue = computed(() => {
    const top = this.topValuedProducts();
    return top.length > 0 ? (top[0].price * top[0].quantity) : 1;
  });
}