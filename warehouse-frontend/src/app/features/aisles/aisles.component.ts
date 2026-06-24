import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InventoryService } from '../../core/services/inventory.service';

@Component({
  selector: 'app-aisles',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="mb-8">
      <h1 class="font-sans text-2xl font-bold text-[#F0F1F5]">Pasillos del Almacén</h1>
      <p class="text-xs text-[#7C8196] mt-1">Selecciona un pasillo para ver sus secciones y productos</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      @for (aisle of viewAisles(); track aisle.id) {
        
        <a [routerLink]="['/inventory']" [queryParams]="{ aisle: aisle.id }" 
           class="bg-[#151820] border border-[#252836] rounded-xl p-5 hover:border-[#FF6B00]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF6B00]/5 cursor-pointer group flex flex-col h-full block no-underline">
          
          <div class="w-11 h-11 rounded-xl flex items-center justify-center text-lg mb-5 transition-colors"
               [style.backgroundColor]="aisle.color + '15'" 
               [style.color]="aisle.color">
            <i class="fas {{ aisle.icon }}"></i>
          </div>

          <div class="mb-5">
            <h3 class="font-bold text-[#F0F1F5] text-base group-hover:text-[#FF6B00] transition-colors">
              Pasillo {{ aisle.id }}
            </h3>
            <p class="text-xs text-[#7C8196] mt-1 line-clamp-1">
              {{ aisle.name || aisle.description }}
            </p>
          </div>

          <div class="mt-auto pt-4 border-t border-[#252836]/80 flex items-center justify-between">
            
            <div class="flex items-center gap-4">
              <div>
                <span class="text-sm font-bold text-[#F0F1F5]">{{ aisle.productCount }}</span>
                <span class="text-[10px] text-[#7C8196] ml-1">productos</span>
              </div>
              
              <div>
                <span class="text-sm font-bold text-[#F0F1F5]">{{ aisle.sectionCount }}</span>
                <span class="text-[10px] text-[#7C8196] ml-1">secciones</span>
              </div>
            </div>

            @if (aisle.lowStockCount > 0) {
              <div>
                <span class="bg-[#EF4444]/15 text-[#EF4444] text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider border border-[#EF4444]/20">
                  {{ aisle.lowStockCount }} BAJO
                </span>
              </div>
            }

          </div>
        </a>

      } @empty {
        <div class="col-span-full py-12 text-center border border-dashed border-[#252836] rounded-xl">
          <i class="fas fa-warehouse text-3xl text-[#7C8196] mb-3 opacity-40"></i>
          <p class="text-sm text-[#7C8196]">No hay pasillos configurados en la base de datos.</p>
        </div>
      }
    </div>
  `
})
export class AislesComponent implements OnInit {
  inventoryService = inject(InventoryService);

  ngOnInit() {
    // 🛡️ Aseguramos la carga de datos por si entran directo a esta ruta
    if (this.inventoryService.aisles().length === 0) {
      this.inventoryService.loadAisles();
    }
    if (this.inventoryService.products().length === 0) {
      this.inventoryService.loadProducts();
    }
  }

  // 🛡️ Motor Computado: Cruza los pasillos con los productos para sacar estadísticas en tiempo real
  viewAisles = computed(() => {
    const aisles = this.inventoryService.aisles();
    const products = this.inventoryService.products();

    // Diccionario visual heredado del diseño original (Colores e Iconos por ID de pasillo)
    const visualMap: Record<number, { icon: string, color: string }> = {
      1: { icon: 'fa-bolt', color: '#FF6B00' },          // Herramientas (Naranja)
      2: { icon: 'fa-cubes', color: '#F59E0B' },         // Materiales (Ámbar)
      3: { icon: 'fa-faucet-drip', color: '#06B6D4' },   // Fontanería (Cyan)
      4: { icon: 'fa-lightbulb', color: '#A78BFA' },     // Eléctrico (Púrpura)
      5: { icon: 'fa-paint-roller', color: '#EC4899' },  // Pinturas (Rosa)
      6: { icon: 'fa-leaf', color: '#10B981' },          // Jardinería (Verde)
    };

    return aisles.map(a => {
      // 1. Filtrar productos que pertenezcan a este pasillo
      const aisleProducts = products.filter(p => p.targetAisleId === a.id);
      
      // 2. Contar cuántos están en stock crítico
      const lowStockCount = aisleProducts.filter(p => p.quantity <= (p.minStock || 5)).length;
      
      // 3. Contar secciones (Si tu ORM trae los 'includes', lo lee directo, sino asume 3 por defecto visual)
      const sectionCount = a.sections ? a.sections.length : 3; 

      // 4. Asignar estilo visual (Fallback genérico si es un pasillo nuevo no mapeado)
      const visual = visualMap[a.id] || { icon: 'fa-warehouse', color: '#7C8196' };

      return {
        ...a,
        icon: visual.icon,
        color: visual.color,
        productCount: aisleProducts.length,
        sectionCount: sectionCount,
        lowStockCount: lowStockCount
      };
    });
  });
}