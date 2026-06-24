import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CurrencyPipe, UpperCasePipe, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../core/services/inventory.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CurrencyPipe, UpperCasePipe, CommonModule, RouterModule, FormsModule],
  template: `
    <div class="store-container">
      <!-- Encabezado con contador del carrito -->
      <div class="store-header">
        <div>
          <h1>🛒 Tienda Warehouse</h1>
          <p>Los mejores productos para tu obra y taller</p>
        </div>
        <button class="btn-cart" (click)="toggleCart()">
          🛒 <span class="badge-cart">{{ cartService.totalItems() }}</span>
        </button>
      </div>

            <!-- Filtro por categoría -->
      <div class="row mb-4">
        <div class="col-md-4">
          <label class="form-label">Filtrar por categoría:</label>
          <select class="form-select" [ngModel]="selectedCategoryId()" (ngModelChange)="selectedCategoryId.set($event)">
            <option [value]="0">Todas las categorías</option>
            @for (cat of categories(); track cat.id) {
              <option [value]="cat.id">{{ cat.name }}</option>
            }
          </select>
        </div>
      </div>

      <!-- CARRUSEL 1: Ofertas Flash -->
      <section class="section offers-section">
        <div class="section-header">
          <h2>⚡ Ofertas Relámpago</h2>
          <span class="timer">⏱️ Termina en 02:15:30</span>
        </div>
        <div class="carousel-horizontal">
          @for (product of flashOffers(); track product.id) {
            <div class="product-card flash-card">
              <div class="badge-offer">-15%</div>
                            <div class="product-img">
                <div class="placeholder-icon">📦</div>
                <img [src]="getProductImage(product)" 
                     alt="{{ product.name }}" 
                     class="product-image"
                     (load)="hidePlaceholder($event)"
                     (error)="showPlaceholder($event)" />
              </div>
              <div class="product-info">
                <h3>{{ product.name | uppercase }}</h3>
                <div class="price-row">
                  <span class="price-discount">{{ (product.price * 0.85) | currency:'USD':'symbol':'1.2-2' }}</span>
                  <span class="price-original">{{ product.price | currency:'USD':'symbol':'1.2-2' }}</span>
                </div>
                <button class="btn-buy" (click)="addToCart(product)">Comprar</button>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- CARRUSEL 2: Nuevos Ingresos -->
      <section class="section new-section">
        <div class="section-header">
          <h2>🆕 Recién Llegados</h2>
        </div>
        <div class="carousel-vertical">
          @for (product of newArrivals(); track product.id) {
            <div class="product-card vertical-card">
              <div class="product-img">
                <img [src]="getProductImage(product)" alt="{{ product.name }}" class="product-image" />
              </div>
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <p>{{ product.description || 'Producto de alta calidad' }}</p>
                <div class="price-row">
                  <span class="price">{{ product.price | currency:'USD':'symbol':'1.2-2' }}</span>
                </div>
                <div class="action-row">
                 <button class="btn-view" [routerLink]="['/product', product.id]">🔍 Ver en el almacén</button>
                </div>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- CARRUSEL 3: Categorías -->
      <section class="section categories-section">
        <div class="section-header">
          <h2>🏷️ Explora por Categorías</h2>
        </div>
        <div class="category-grid">
          @for (cat of categories(); track cat.id) {
            <div class="category-card">
              <div class="cat-icon">{{ cat.icon }}</div>
              <span>{{ cat.name }}</span>
            </div>
          }
        </div>
      </section>

      <!-- CARRUSEL 4: Destacados -->
      <section class="section featured-section">
        <div class="section-header">
          <h2>⭐ Destacados de la Semana</h2>
        </div>
        <div class="carousel-horizontal">
          @for (product of featuredProducts(); track product.id) {
            <div class="product-card featured-card">
              <div class="product-img">
                <img [src]="getProductImage(product)" alt="{{ product.name }}" class="product-image" />
              </div>
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <div class="price-row">
                  <span class="price">{{ product.price | currency:'USD':'symbol':'1.2-2' }}</span>
                </div>
                <div class="action-row">
                  <button class="btn-view" [routerLink]="['/product', product.id]">👁️ Ver producto</button>
                  <button class="btn-buy" (click)="addToCart(product)">🛒 Agregar</button>
                </div>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- MODAL DEL CARRITO -->
      @if (showCart()) {
        <div class="cart-overlay" (click)="toggleCart()">
          <div class="cart-modal" (click)="$event.stopPropagation()">
            <div class="cart-header">
              <h3>🛒 Tu Carrito</h3>
              <button class="btn-close" (click)="toggleCart()">✕</button>
            </div>
            <div class="cart-body">
              @if (cartService.items().length === 0) {
                <p class="empty-cart">El carrito está vacío</p>
              } @else {
                @for (item of cartService.items(); track item.product.id) {
                  <div class="cart-item">
                    <div class="item-info">
                      <strong>{{ item.product.name }}</strong>
                      <span>{{ item.product.price | currency:'USD':'symbol':'1.2-2' }}</span>
                    </div>
                    <div class="item-actions">
                      <button class="qty-btn" (click)="updateQuantity(item.product.id, item.quantity - 1)">−</button>
                      <span>{{ item.quantity }}</span>
                      <button class="qty-btn" (click)="updateQuantity(item.product.id, item.quantity + 1)">+</button>
                      <button class="btn-remove" (click)="removeFromCart(item.product.id)">🗑️</button>
                    </div>
                  </div>
                }
                <div class="cart-total">
                  <strong>Total:</strong>
                  <span>{{ cartService.totalPrice() | currency:'USD':'symbol':'1.2-2' }}</span>
                </div>
                <button class="btn-checkout" (click)="checkout()">Pagar Ahora</button>
                <button class="btn-clear" (click)="clearCart()">Vaciar Carrito</button>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .store-container { padding: 2rem; background: #f8f9fa; min-height: 100vh; }
    .store-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
    .store-header h1 { font-size: 2.5rem; color: #1a2e2c; }
    .store-header p { color: #6c757d; font-size: 1.1rem; }
    
    .btn-cart { background: #0D6E6E; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-size: 1.1rem; transition: background 0.2s; }
    .btn-cart:hover { background: #0A5555; }
    .badge-cart { background: #d9534f; color: white; border-radius: 50%; padding: 0.1rem 0.5rem; font-size: 0.8rem; font-weight: bold; }

    .section { margin-bottom: 3rem; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .section-header h2 { font-size: 1.5rem; color: #1a2e2c; }
    .timer { color: #d9534f; font-weight: bold; }

    .carousel-horizontal { display: flex; overflow-x: auto; gap: 1.5rem; padding-bottom: 1rem; scroll-behavior: smooth; }
    .carousel-horizontal::-webkit-scrollbar { height: 6px; }
    .carousel-horizontal::-webkit-scrollbar-thumb { background: #0D6E6E; border-radius: 10px; }

    /* IMÁGENES DE PRODUCTOS */
    .product-img {
      width: 100%;
      height: 160px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;
      overflow: hidden;
      border-radius: 8px;
    }
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-card { min-width: 220px; background: white; border-radius: 16px; padding: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center; transition: transform 0.3s, box-shadow 0.3s; flex-shrink: 0; }
    .product-card:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }

    .product-info h3 { font-size: 1.1rem; margin: 0.5rem 0; }
    .price-row { display: flex; justify-content: center; gap: 0.5rem; margin: 0.5rem 0; }
    .price { font-weight: bold; color: #1a2e2c; }
    .price-original { text-decoration: line-through; color: #999; font-size: 0.9rem; }
    .price-discount { font-weight: bold; color: #d9534f; font-size: 1.2rem; }
    
    .btn-buy { background: #0D6E6E; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; transition: background 0.2s; width: 100%; }
    .btn-buy:hover { background: #0A5555; }

    .flash-card { border: 2px solid #d9534f; position: relative; }
    .badge-offer { position: absolute; top: -10px; right: -10px; background: #d9534f; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }

    .carousel-vertical { display: flex; flex-direction: column; gap: 1rem; max-height: 600px; overflow-y: auto; padding-right: 0.5rem; }
    .carousel-vertical::-webkit-scrollbar { width: 6px; }
    .carousel-vertical::-webkit-scrollbar-thumb { background: #0D6E6E; border-radius: 10px; }
    .vertical-card { display: flex; flex-direction: row; align-items: center; text-align: left; gap: 1rem; min-width: unset; }
    .vertical-card .product-img { height: 120px; width: 120px; flex-shrink: 0; margin: 0; }
    .vertical-card .product-info { flex: 1; }
    
    /* BOTONES DE ACCIÓN */
    .action-row { display: flex; gap: 0.75rem; margin-top: 0.75rem; }
    .btn-view {
      flex: 1;
      background: transparent;
      color: #0D6E6E;
      border: 2px solid #0D6E6E;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .btn-view:hover { background: #0D6E6E; color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(13, 110, 110, 0.3); }
    .btn-buy { flex: 1; background: #0D6E6E; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; transition: background 0.2s; font-weight: 600; width: auto; }
    .btn-buy:hover { background: #0A5555; }

    .category-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem; }
    .category-card { background: white; border-radius: 16px; padding: 1.5rem 1rem; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05); cursor: pointer; transition: transform 0.2s; }
    .category-card:hover { transform: scale(1.05); }
    .cat-icon { font-size: 2.5rem; }
    .category-card span { font-weight: 500; color: #1a2e2c; }

    /* CARRITO MODAL */
    .cart-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; justify-content: flex-end; }
    .cart-modal { background: white; width: 400px; height: 100%; padding: 2rem; display: flex; flex-direction: column; animation: slideIn 0.3s ease; }
    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
    .cart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .cart-header h3 { font-size: 1.5rem; margin: 0; }
    .btn-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666; }
    .cart-body { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; }
    .empty-cart { text-align: center; color: #999; margin-top: 2rem; }
    .cart-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #f0f0f0; }
    .item-info { display: flex; flex-direction: column; }
    .item-actions { display: flex; align-items: center; gap: 0.5rem; }
    .qty-btn { background: #f0f0f0; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 1rem; }
    .btn-remove { background: none; border: none; cursor: pointer; color: #d9534f; font-size: 1.2rem; }
    .cart-total { display: flex; justify-content: space-between; padding: 1rem 0; border-top: 2px solid #f0f0f0; font-size: 1.2rem; }
    .btn-checkout { background: #0D6E6E; color: white; border: none; padding: 0.75rem; border-radius: 8px; cursor: pointer; width: 100%; margin-top: 1rem; }
    .btn-checkout:hover { background: #0A5555; }
    .btn-clear { background: transparent; color: #d9534f; border: 1px solid #d9534f; padding: 0.75rem; border-radius: 8px; cursor: pointer; width: 100%; margin-top: 0.5rem; }
        /* IMÁGENES DE PRODUCTOS - Versión mejorada */
       /* IMÁGENES DE PRODUCTOS - Versión Premium */
    .product-img {
      width: 100%;
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;
      overflow: hidden;
      border-radius: 12px;
      background: #f5f6fa;  /* Un gris azulado muy suave (fondo limpio) */
      position: relative;
    }
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      transition: opacity 0.3s ease;
    }
    /* Si la imagen no carga, se muestra un icono de caja */
    .product-img .placeholder-icon {
      font-size: 4rem;
      color: #b0b8c4;
      opacity: 0.8;
    }
    /* Cuando la imagen está cargada, ocultamos el placeholder */
    .product-img .placeholder-icon.hidden {
      display: none;
    }

    /* Para la lista vertical (Recién Llegados) */
    .vertical-card .product-img {
      height: 120px;
      width: 140px;
      flex-shrink: 0;
      margin: 0;
      border-radius: 12px;
    }
  `]
})
export class StoreComponent implements OnInit {
  inventory = inject(InventoryService);
  cartService = inject(CartService);

  showCart = signal(false);

  categories = signal([
    { id: 1, name: 'Herramientas', icon: '🔧' },
    { id: 2, name: 'Pinturas', icon: '🎨' },
    { id: 3, name: 'Materiales', icon: '🧱' },
    { id: 4, name: 'Eléctricos', icon: '⚡' },
    { id: 5, name: 'Jardinería', icon: '🌿' },
  ]);


  selectedCategoryId = signal<number>(0);



  ngOnInit() {
    if (this.inventory.products().length === 0) {
      this.inventory.loadProducts();
    }
  }

    // Reemplaza featuredProducts con un computed que filtra por categoría
  featuredProducts = computed(() => {
    let products = this.inventory.products();
    const catId = this.selectedCategoryId();
    if (catId > 0) {
      products = products.filter(p => p.categoryId === catId);
    }
    return products.slice(0, 4);
  });


  getProductImage(product: any): string {
    // Si el producto tiene una imagen subida, úsala
    if (product.imageUrl) {
      return product.imageUrl;
    }
    // Si no, usa una imagen por defecto
    return 'https://images.unsplash.com/photo-1584341604662-6b724c3d2eb4?w=600&h=600&fit=crop&crop=center';
  }

  toggleCart() { this.showCart.update(v => !v); }
  addToCart(product: any) { this.cartService.addToCart(product); if (!this.showCart()) this.showCart.set(true); }
  removeFromCart(productId: string) { this.cartService.removeFromCart(productId); }
  updateQuantity(productId: string, quantity: number) { this.cartService.updateQuantity(productId, quantity); }
  clearCart() { this.cartService.clearCart(); this.showCart.set(false); }
  checkout() {
    alert('🧾 ¡Gracias por tu compra! Total a pagar: ' + this.cartService.totalPrice().toFixed(2));
    this.cartService.clearCart(); this.showCart.set(false);
  }

  // Ocultar el placeholder cuando la imagen carga
  hidePlaceholder(event: any) {
    const img = event.target;
    const parent = img.closest('.product-img');
    if (parent) {
      const placeholder = parent.querySelector('.placeholder-icon');
      if (placeholder) placeholder.classList.add('hidden');
    }
  }

  // Si la imagen da error, mostrar el placeholder
  showPlaceholder(event: any) {
    const img = event.target;
    img.style.display = 'none';
    const parent = img.closest('.product-img');
    if (parent) {
      const placeholder = parent.querySelector('.placeholder-icon');
      if (placeholder) placeholder.classList.remove('hidden');
    }
  }

  
  flashOffers = computed(() => [...this.inventory.products()].sort((a, b) => b.price - a.price).slice(0, 3));
  newArrivals = computed(() => this.inventory.products().slice(-3).reverse());
}