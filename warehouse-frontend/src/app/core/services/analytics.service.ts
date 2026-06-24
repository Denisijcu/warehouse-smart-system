
import { Injectable, signal, computed, inject } from '@angular/core';
import { InventoryService } from './inventory.service';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private inventory = inject(InventoryService);

  // 1. Productos con stock bajo (alerta roja)
  lowStockProducts = computed(() => {
    return this.inventory.products().filter(p => p.quantity <= p.minStock);
  });

  // 2. Total de productos
  totalProducts = computed(() => this.inventory.products().length);

  // 3. Total de stock en el almacén (suma de todas las cantidades)
  totalStock = computed(() => {
    return this.inventory.products().reduce((acc, p) => acc + p.quantity, 0);
  });

  // 4. Productos agrupados por Pasillo (para el gráfico de barras)
  productsByAisle = computed(() => {
    const aisles = this.inventory.aisles();
    const products = this.inventory.products();

    return aisles.map(aisle => {
      const count = products.filter(p => p.targetAisleId === aisle.id).length;
      return { name: aisle.name, count };
    }).filter(a => a.count > 0);
  });
}