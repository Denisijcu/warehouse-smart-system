import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../core/services/inventory.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-6">
      <h1 class="font-sans text-2xl font-bold text-[#F0F1F5]">Control de Movimientos</h1>
      <p class="text-xs text-[#7C8196] mt-0.5">Registro de entrada y salida de productos</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <div class="bg-[#151820] border border-[#252836] rounded-xl p-6 h-fit">
        <h3 class="font-bold text-[#F0F1F5] text-sm mb-5">Nuevo Registro</h3>
        
        <form (ngSubmit)="submitMovement()">
          <div class="mb-5">
            <label class="block text-[10px] font-bold text-[#7C8196] uppercase tracking-wider mb-2">Tipo</label>
            <div class="flex gap-2">
              <label class="flex-1 cursor-pointer">
                <input type="radio" name="tipo" value="in" class="hidden peer" [(ngModel)]="formType">
                <div class="peer-checked:border-[#10B981] peer-checked:text-[#10B981] peer-checked:bg-[#10B981]/10 border border-[#252836] bg-[#0C0E14] text-[#7C8196] text-center py-2.5 rounded-lg transition-all text-xs font-medium flex items-center justify-center gap-2">
                  <i class="fas fa-arrow-down"></i> Entrada
                </div>
              </label>
              <label class="flex-1 cursor-pointer">
                <input type="radio" name="tipo" value="out" class="hidden peer" [(ngModel)]="formType">
                <div class="peer-checked:border-[#EF4444] peer-checked:text-[#EF4444] peer-checked:bg-[#EF4444]/10 border border-[#252836] bg-[#0C0E14] text-[#7C8196] text-center py-2.5 rounded-lg transition-all text-xs font-medium flex items-center justify-center gap-2">
                  <i class="fas fa-arrow-up"></i> Salida
                </div>
              </label>
            </div>
          </div>

          <div class="mb-5">
            <label class="block text-[10px] font-bold text-[#7C8196] uppercase tracking-wider mb-2">Producto</label>
            <select class="w-full bg-[#0C0E14] border border-[#252836] text-[#F0F1F5] text-sm rounded-lg p-3 outline-none focus:border-[#FF6B00] transition-colors"
                    name="producto" [(ngModel)]="formProductId" required>
              <option value="">Seleccionar...</option>
              @for (p of inventoryService.products(); track p.id) {
                <option [value]="p.id">{{ p.name }} ({{ p.quantity }} uds)</option>
              }
            </select>
          </div>

          <div class="mb-5">
            <label class="block text-[10px] font-bold text-[#7C8196] uppercase tracking-wider mb-2">Cantidad</label>
            <input type="number" class="w-full bg-[#0C0E14] border border-[#252836] text-[#F0F1F5] text-sm rounded-lg p-3 outline-none focus:border-[#FF6B00] transition-colors"
                   name="cantidad" [(ngModel)]="formQuantity" min="1" placeholder="Unidades" required>
          </div>

          <div class="mb-5">
            <label class="block text-[10px] font-bold text-[#7C8196] uppercase tracking-wider mb-2">Proveedor</label>
            <select class="w-full bg-[#0C0E14] border border-[#252836] text-[#F0F1F5] text-sm rounded-lg p-3 outline-none focus:border-[#FF6B00] transition-colors"
                    name="proveedor" [(ngModel)]="formSupplierId">
              <option value="">Seleccionar...</option>
              @for (prov of inventoryService.suppliers(); track prov.id) {
                <option [value]="prov.id">{{ prov.name }}</option>
              }
            </select>
          </div>

          <div class="mb-6">
            <label class="block text-[10px] font-bold text-[#7C8196] uppercase tracking-wider mb-2">Nota</label>
            <input type="text" class="w-full bg-[#0C0E14] border border-[#252836] text-[#F0F1F5] text-sm rounded-lg p-3 outline-none focus:border-[#FF6B00] transition-colors"
                   name="nota" [(ngModel)]="formNote" placeholder="Descripción">
          </div>

          <button type="submit" class="w-full bg-[#FF6B00] hover:bg-[#CC5500] text-white font-bold text-sm py-3 rounded-lg transition-colors shadow-lg shadow-[#FF6B00]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  [disabled]="isSubmitting()">
            @if (isSubmitting()) {
              <i class="fas fa-circle-notch fa-spin"></i> Procesando...
            } @else {
              <i class="fas fa-check"></i> Registrar
            }
          </button>
        </form>

        @if (errorMessage()) {
          <div class="mt-4 p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-xs flex items-center gap-2">
            <i class="fas fa-exclamation-triangle"></i> {{ errorMessage() }}
          </div>
        }
        @if (successMessage()) {
          <div class="mt-4 p-3 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs flex items-center gap-2">
            <i class="fas fa-check-circle"></i> {{ successMessage() }}
          </div>
        }
      </div>

      <div class="bg-[#151820] border border-[#252836] rounded-xl p-6 lg:col-span-2 flex flex-col h-full">
        <h3 class="font-bold text-[#F0F1F5] text-sm mb-1">Historial</h3>
        <p class="text-[10px] text-[#7C8196] mb-5">{{ viewMovements().length }} registros</p>

        <div class="overflow-x-auto flex-1">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr>
                <th class="p-3 text-[10px] uppercase tracking-wider text-[#7C8196] border-b border-[#252836] font-bold">Tipo</th>
                <th class="p-3 text-[10px] uppercase tracking-wider text-[#7C8196] border-b border-[#252836] font-bold">Producto</th>
                <th class="p-3 text-[10px] uppercase tracking-wider text-[#7C8196] border-b border-[#252836] font-bold">Cant.</th>
                <th class="p-3 text-[10px] uppercase tracking-wider text-[#7C8196] border-b border-[#252836] font-bold">Proveedor</th>
                <th class="p-3 text-[10px] uppercase tracking-wider text-[#7C8196] border-b border-[#252836] font-bold">Fecha</th>
                <th class="p-3 text-[10px] uppercase tracking-wider text-[#7C8196] border-b border-[#252836] font-bold">Nota</th>
              </tr>
            </thead>
            <tbody>
              @for (mov of viewMovements(); track mov.id) {
                <tr class="hover:bg-[#FF6B00]/5 transition-colors border-b border-[#252836]/50">
                  <td class="p-3">
                    @if (mov.type === 'in' || mov.tipo === 'entrada') {
                      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">IN</span>
                    } @else {
                      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">OUT</span>
                    }
                  </td>
                  <td class="p-3 text-xs font-medium text-[#F0F1F5]">{{ mov.product?.name || 'N/A' }}</td>
                  <td class="p-3 text-xs text-[#F0F1F5]">{{ mov.quantity || mov.cant }}</td>
                  <td class="p-3 text-xs text-[#7C8196]">{{ mov.supplier?.name || mov.prov || '—' }}</td>
                  <td class="p-3 text-xs text-[#7C8196]">{{ (mov.createdAt || mov.fecha) | date:'yyyy-MM-dd HH:mm' }}</td>
                  <td class="p-3 text-xs text-[#7C8196]">{{ mov.note || mov.nota || '—' }}</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="p-8 text-center text-[#7C8196] text-xs border-b border-[#252836]/50">
                    <i class="fas fa-file-invoice mb-2 text-xl opacity-50 block"></i>
                    No hay movimientos registrados.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class MovementsComponent implements OnInit {
  inventoryService = inject(InventoryService);
  authService = inject(AuthService);

  // 🛡️ Estado del Formulario
  formType = signal<'in' | 'out'>('in');
  formProductId = signal<string>('');
  formQuantity = signal<number | null>(null);
  formSupplierId = signal<string>('');
  formNote = signal<string>('');

  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  ngOnInit() {
    if (this.inventoryService.products().length === 0) this.inventoryService.loadProducts();
    if (this.inventoryService.suppliers().length === 0) this.inventoryService.loadSuppliers();
    if (this.inventoryService.movements().length === 0) this.inventoryService.loadMovements();
  }

  // 🛡️ Invertimos el array para que el historial muestre el último arriba (Igual al rMov() original)
  // 🛡️ Invertimos el array y casteamos a any para el bypass del tipado estricto
  viewMovements = computed(() => {
    return [...this.inventoryService.movements()].reverse() as any[];
  });

  submitMovement() {
    this.errorMessage.set('');
    this.successMessage.set('');

    const pid = this.formProductId();
    const cant = this.formQuantity();
    const type = this.formType();

    if (!pid || !cant || cant <= 0) {
      this.errorMessage.set('Completa los campos obligatorios correctamente.');
      return;
    }

    // 🛡️ Validación de Stock Crítico (Extraída directo de tu sMov() original) [cite: 71]
    const product = this.inventoryService.products().find(p => p.id === pid);
    if (type === 'out' && product && cant > product.quantity) {
      this.errorMessage.set(`Stock insuficiente. Solo hay ${product.quantity} uds.`);
      return;
    }

    this.isSubmitting.set(true);

    // Conectamos con el endpoint que blindaste en el backend
    this.inventoryService.updateStock(pid, cant, type).subscribe({
      next: () => {
        this.successMessage.set('Movimiento registrado con éxito.');
        this.isSubmitting.set(false);
        this.resetForm();
        
        // Recargar el estado para que la tabla y el inventario general se actualicen
        this.inventoryService.loadProducts();
        this.inventoryService.loadMovements();

        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        this.errorMessage.set('Error al registrar: ' + (err.error?.error || err.message));
        this.isSubmitting.set(false);
      }
    });
  }

  resetForm() {
    this.formProductId.set('');
    this.formQuantity.set(null);
    this.formSupplierId.set('');
    this.formNote.set('');
  }
}