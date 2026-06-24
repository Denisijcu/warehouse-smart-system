import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Señal privada para el estado interno
  private readonly cartItems = signal<CartItem[]>([]);

  // Señal pública de solo lectura
  readonly items = this.cartItems.asReadonly();

  // Señal computada: total de items (suma de cantidades)
  readonly totalItems = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
  });

  // Señal computada: total a pagar
  readonly totalPrice = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  });

  constructor() {
    // Cargar el carrito desde localStorage al iniciar la app
    this.loadFromStorage();
  }

  // Agregar producto al carrito
  addToCart(product: Product): void {
    this.cartItems.update(items => {
      const existingItem = items.find(item => item.product.id === product.id);
      if (existingItem) {
        // Si ya está en el carrito, solo aumentamos la cantidad
        return items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si no está, lo agregamos con cantidad 1
        return [...items, { product, quantity: 1 }];
      }
    });
    this.saveToStorage();
  }

  // Eliminar un producto del carrito (completamente)
  removeFromCart(productId: string): void {
    this.cartItems.update(items => items.filter(item => item.product.id !== productId));
    this.saveToStorage();
  }

  // Cambiar la cantidad de un producto
  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems.update(items =>
      items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
    this.saveToStorage();
  }

  // Vaciar el carrito completamente
  clearCart(): void {
    this.cartItems.set([]);
    localStorage.removeItem('cart');
  }

  // Guardar en localStorage
  private saveToStorage(): void {
    try {
      localStorage.setItem('cart', JSON.stringify(this.cartItems()));
    } catch (error) {
      console.warn('No se pudo guardar el carrito en localStorage', error);
    }
  }

  // Cargar desde localStorage
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('cart');
      if (stored) {
        const items = JSON.parse(stored);
        this.cartItems.set(items);
      }
    } catch (error) {
      console.warn('No se pudo cargar el carrito desde localStorage', error);
      localStorage.removeItem('cart');
    }
  }
}