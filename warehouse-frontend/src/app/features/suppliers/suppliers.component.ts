import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../core/services/inventory.service';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-8">
      <h1 class="font-sans text-2xl font-bold text-[#F0F1F5]">Proveedores</h1>
      <p class="text-xs text-[#7C8196] mt-1">{{ inventoryService.suppliers().length }} registrados en el sistema</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      @for (prov of viewSuppliers(); track prov.id) {
        
        <div class="bg-[#151820] border border-[#252836] rounded-xl p-5 hover:border-[#FF6B00]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#FF6B00]/5 group">
          
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-[#FF6B00] bg-[#FF6B00]/10 uppercase">
              {{ prov.name.charAt(0) }}
            </div>
            <div class="min-w-0">
              <h3 class="font-bold text-[#F0F1F5] text-sm truncate">{{ prov.name }}</h3>
              <p class="text-[10px] text-[#7C8196] uppercase tracking-wider">{{ prov.address }}</p>
            </div>
          </div>

          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-3 text-xs text-[#7C8196]">
              <i class="fas fa-envelope w-4 text-center text-[#FF6B00]"></i>
              <span class="truncate">{{ prov.email }}</span>
            </div>
            <div class="flex items-center gap-3 text-xs text-[#7C8196]">
              <i class="fas fa-phone w-4 text-center text-[#FF6B00]"></i>
              <span>{{ prov.phone }}</span>
            </div>
          </div>

          <div class="pt-4 border-t border-[#252836] mt-auto">
            <div class="text-[10px] text-[#7C8196] mb-2 uppercase font-bold tracking-widest">
              {{ prov.products.length }} productos suministrados
            </div>
            <div class="flex flex-wrap gap-1.5">
              @for (prod of prov.products.slice(0, 4); track prod.id) {
                <span class="px-2 py-1 rounded bg-[#0C0E14] border border-[#252836] text-[#7C8196] text-[9px] font-medium uppercase truncate max-w-[100px]">
                  {{ prod.name }}
                </span>
              }
              @if (prov.products.length > 4) {
                <span class="px-2 py-1 text-[#FF6B00] text-[9px] font-bold">+{{ prov.products.length - 4 }}</span>
              }
            </div>
          </div>
        </div>
        
      } @empty {
        <div class="col-span-full py-16 text-center border-2 border-dashed border-[#252836] rounded-2xl">
          <i class="fas fa-truck-field text-4xl text-[#7C8196] mb-3 block opacity-40"></i>
          <p class="text-sm text-[#7C8196]">No hay proveedores registrados.</p>
        </div>
      }
    </div>
  `
})
export class SuppliersComponent {
  inventoryService = inject(InventoryService);

  // 🛡️ Motor computado que cruza Proveedores con Productos en tiempo real
  viewSuppliers = computed(() => {
    const suppliers = this.inventoryService.suppliers();
    const products = this.inventoryService.products();

    return suppliers.map(s => ({
      ...s,
      // Ajusta 'p.supplierName' o la propiedad que uses para el nombre del proveedor en Product
      products: products.filter(p => p.supplierId === s.id || p.name === s.name)
    }));
});
}