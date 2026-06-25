import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InventoryService } from '../../core/services/inventory.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  template: `
    <div class="mb-6 flex flex-wrap gap-4 items-center justify-between">
      <div>
        <h1 class="font-sans text-2xl font-bold text-[#F0F1F5]">Inventario Completo</h1>
        <p class="text-xs text-[#7C8196] mt-0.5">{{ viewProducts().length }} de {{ inventoryService.products().length }} productos</p>
      </div>
      
      @if (authService.isAdmin()) {
        <button class="bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-[#10B981]/20 flex items-center gap-2" (click)="openAddProduct()">
          <i class="fas fa-plus"></i> Agregar Producto
        </button>
      }
    </div>


    <div class="mb-6 flex justify-between items-center bg-[#151820] p-4 rounded-xl border border-[#252836]">
  <div class="relative w-full max-w-md">
    <i class="fas fa-search absolute left-3 top-3 text-[#7C8196]"></i>
    <input type="text" 
           placeholder="Buscar por nombre o SKU..." 
           [ngModel]="searchTerm()" 
           (ngModelChange)="searchTerm.set($event)"
           class="w-full bg-[#0C0E14] border border-[#252836] rounded-lg pl-10 pr-4 py-2 text-sm text-white outline-none focus:border-[#FF6B00] transition-colors">
  </div>
  <div class="text-[#7C8196] text-xs font-medium">
    {{ viewProducts().length }} productos encontrados
  </div>
</div>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      @for (product of viewProducts(); track product.id) {
        <div class="bg-[#151820] border border-[#252836] rounded-[14px] p-4 flex flex-col group hover:border-[#FF6B00]/40 transition-all">
          <img [src]="getProductImage(product)" class="w-full aspect-square object-cover rounded-lg mb-3" alt="{{ product.name }}">
          <h3 class="font-bold text-[#F0F1F5] text-sm">{{ product.name }}</h3>
          <p class="text-[10px] text-[#7C8196] mb-2">SKU: {{ product.sku }}</p>
          <div class="mt-auto pt-3 border-t border-[#252836] flex justify-between items-center">
            <span class="text-lg font-black text-[#FF6B00]">\${{ product.price | number:'1.2-2' }}</span>
            <button class="bg-[#FF6B00] text-white px-4 py-2 rounded-lg text-xs font-bold" [routerLink]="['/product', product.id]">Detalle</button>
          </div>
        </div>
      }
    </div>

    <!-- Modal de Agregar Producto (Con múltiples imágenes) -->
    @if (isAddModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div class="bg-[#151820] border border-[#252836] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
          <div class="p-5 border-b border-[#252836] flex justify-between items-center">
            <h3 class="font-bold text-[#F0F1F5]">Nuevo Producto</h3>
            <button class="text-[#7C8196]" (click)="closeAddProduct()"><i class="fas fa-times"></i></button>
          </div>
          <div class="p-6 space-y-4">
            <input [(ngModel)]="newProduct().name" placeholder="Nombre del producto" class="w-full bg-[#0C0E14] border border-[#252836] rounded-lg p-3 text-sm text-white focus:border-[#FF6B00] outline-none">
            <input [(ngModel)]="newProduct().sku" placeholder="SKU" class="w-full bg-[#0C0E14] border border-[#252836] rounded-lg p-3 text-sm text-white focus:border-[#FF6B00] outline-none">
            <input [(ngModel)]="newProduct().price" type="number" placeholder="Precio" class="w-full bg-[#0C0E14] border border-[#252836] rounded-lg p-3 text-sm text-white focus:border-[#FF6B00] outline-none">
            <div class="flex flex-col gap-1">
              <label class="text-xs text-[#7C8196] font-medium">Sección *</label>
              <select [(ngModel)]="newProduct().sectionId" class="w-full bg-[#0C0E14] border border-[#252836] rounded-lg p-3 text-sm text-white focus:border-[#FF6B00] outline-none">
                <option [value]="0">Selecciona una sección</option>
                @for (aisle of inventoryService.aisles(); track aisle.id) {
                  @for (section of aisle.sections; track section.id) {
                    <option [value]="section.id">{{ aisle.name }} - {{ section.name }}</option>
                  }
                }
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs text-[#7C8196] font-medium">Proveedor *</label>
              <select [(ngModel)]="newProduct().supplierId" class="w-full bg-[#0C0E14] border border-[#252836] rounded-lg p-3 text-sm text-white focus:border-[#FF6B00] outline-none">
                <option [value]="">Selecciona un proveedor</option>
                @for (supplier of inventoryService.suppliers(); track supplier.id) {
                  <option [value]="supplier.id">{{ supplier.name }}</option>
                }
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <input [(ngModel)]="newProduct().quantity" type="number" placeholder="Stock inicial" class="w-full bg-[#0C0E14] border border-[#252836] rounded-lg p-3 text-sm text-white focus:border-[#FF6B00] outline-none">
              <input [(ngModel)]="newProduct().minStock" type="number" placeholder="Stock mínimo" class="w-full bg-[#0C0E14] border border-[#252836] rounded-lg p-3 text-sm text-white focus:border-[#FF6B00] outline-none">
            </div>

            <!-- 🖼️ SUBIDA DE IMÁGENES -->
            <div class="flex flex-col gap-1">
              <label class="text-xs text-[#7C8196] font-medium">Imágenes del producto</label>
              <input type="file" class="w-full bg-[#0C0E14] border border-[#252836] rounded-lg p-2 text-sm text-white focus:border-[#FF6B00] outline-none" (change)="onFilesSelected($event)" accept="image/*" multiple>
              @if (selectedFiles().length > 0) {
                <div class="mt-2 flex flex-wrap gap-2">
                  @for (file of selectedFiles(); track file.file.name) {
                    <div class="relative w-16 h-16 rounded-lg overflow-hidden border border-[#252836]">
                      <img [src]="file.previewUrl" class="w-full h-full object-cover">
                      <button class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs" (click)="removeFile(file)">✕</button>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
          <div class="p-4 border-t border-[#252836] flex gap-3 bg-[#0C0E14]">
            <button class="flex-1 py-2 rounded-lg text-[#7C8196] border border-[#252836]" (click)="closeAddProduct()">Cancelar</button>
            <button class="flex-1 py-2 rounded-lg bg-[#10B981] text-white font-bold" (click)="confirmAddProduct()">Guardar</button>
          </div>
        </div>
      </div>
    }
  `
})
export class InventoryComponent implements OnInit {
  inventoryService = inject(InventoryService);
  authService = inject(AuthService);

  isAddModalOpen = signal(false);
  newProduct = signal({
    name: '',
    sku: '',
    price: 0,
    quantity: 0,
    minStock: 5,
    sectionId: 0,
    supplierId: ''
  });

  selectedFiles = signal<{ file: File; previewUrl: string }[]>([]);

  showStockModal = signal<boolean>(false);
  modalAction = signal<'in' | 'out'>('in');
  modalQuantity = signal<number>(1);

  searchTerm = signal<string>('');

  ngOnInit() {
    this.inventoryService.loadProducts();
    this.inventoryService.loadAisles();
    this.inventoryService.loadSuppliers();
  }

    getProductImage(product: any): string {
    const images = product.ProductImages || product.productImages || product.images;
    if (images && images.length > 0) {
      const mainImage = images.find((img: any) => img.isMain) || images[0];
      // 🔥 CORRECCIÓN: Reemplazar localhost por la URL de Railway
      return mainImage.imageUrl.replace('http://localhost:3000', 'https://warehouse-smart-system-production.up.railway.app');
    }
    // 🔥 CORRECCIÓN: También reemplazar en la imagen por defecto si existe
    const fallback = product.imageUrl || 'https://images.unsplash.com/photo-1504145554044-1f1f9b0c5f8a?w=600&h=600&fit=crop&crop=center';
    return fallback.replace('http://localhost:3000', 'https://warehouse-smart-system-production.up.railway.app');
  }

  onFilesSelected(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      const newFiles = Array.from(files).map((file: any) => ({
        file,
        previewUrl: URL.createObjectURL(file)
      }));
      this.selectedFiles.update(current => [...current, ...newFiles]);
    }
  }

  removeFile(fileToRemove: { file: File; previewUrl: string }) {
    this.selectedFiles.update(current => current.filter(f => f.file !== fileToRemove.file));
  }

  openAddProduct() {
    this.newProduct.set({
      name: '',
      sku: '',
      price: 0,
      quantity: 0,
      minStock: 5,
      sectionId: 0,
      supplierId: ''
    });
    this.selectedFiles.set([]);
    this.isAddModalOpen.set(true);
  }

  closeAddProduct() {
    this.isAddModalOpen.set(false);
  }

  confirmAddProduct() {
    const product = this.newProduct();
    if (!product.name || !product.sku) {
      alert('❌ El nombre y el SKU son obligatorios.');
      return;
    }
    if (!product.sectionId || product.sectionId === 0) {
      alert('❌ Debes seleccionar una sección.');
      return;
    }
    if (!product.supplierId) {
      alert('❌ Debes seleccionar un proveedor.');
      return;
    }

    this.closeAddProduct();

    this.inventoryService.addProduct(product).subscribe({
      next: (newProductFromBackend) => {
        const files = this.selectedFiles();
        if (files.length > 0) {
          const fileArray = files.map(f => f.file);
          this.inventoryService.uploadMultipleImages(newProductFromBackend.id, fileArray).subscribe({
            next: () => {
              this.inventoryService.loadProducts();
              this.selectedFiles.set([]);
              console.log('✅ Producto creado e imágenes subidas');
            },
            error: (err) => {
              alert('❌ Producto creado, pero error al subir imágenes: ' + err.message);
              this.inventoryService.loadProducts();
            }
          });
        } else {
          this.inventoryService.loadProducts();
        }
      },
      error: (err) => {
        alert('❌ Error al guardar el producto: ' + (err.error?.error || err.message));
      }
    });
  }

  openStockModal(id: string, act: 'in' | 'out') {
    this.showStockModal.set(true);
    this.modalAction.set(act);
  }

  closeStockModal() {
    this.showStockModal.set(false);
  }

  confirmStockUpdate() {
    this.closeStockModal();
  }

 // 2. Actualiza el computed de viewProducts
viewProducts = computed(() => {
  const term = this.searchTerm().toLowerCase().trim();
  const products = this.inventoryService.products();

  if (!term) return products;

  return products.filter(p => 
    p.name.toLowerCase().includes(term) || 
    p.sku.toLowerCase().includes(term)
  );
});
}