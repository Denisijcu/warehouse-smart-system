import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Aisle, Section, Supplier, StockMovement } from '../models/product.model';
import { tap } from 'rxjs/operators'; // Asegúrate de importar esto

@Injectable({ providedIn: 'root' })
export class InventoryService {
    private apiUrl = 'http://localhost:3000/api';

    // Señales reactivas
    products = signal<Product[]>([]);
    aisles = signal<Aisle[]>([]);
    suppliers = signal<Supplier[]>([]);
    movements = signal<StockMovement[]>([]);

    constructor(private http: HttpClient) { 
        // 🛡️ MOTOR ENCENDIDO: Carga inicial automática
        this.loadProducts();
        this.loadAisles();
        this.loadSuppliers();
        this.loadMovements();
    }

    // ==========================================
    // PRODUCTOS
    // ==========================================
    loadProducts(): void {
        this.http.get<Product[]>(`${this.apiUrl}/products`).subscribe(data => {
            //console.log('Productos cargados (RAW):', data);

            // Mapeo de datos para inyectar targetAisleId (necesario para los reportes)
            const mappedProducts = data.map((p: any) => {
                const sectionData = p.Section || p.section;
                return {
                    ...p,
                    targetAisleId: sectionData?.aisleId || null
                };
            });

            this.products.set(mappedProducts);
        });
    }

    uploadMultipleImages(productId: string, files: File[]): Observable<any> {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        return this.http.post(`${this.apiUrl}/products/${productId}/images`, formData);
    }

    uploadProductImage(productId: string, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('image', file);
        return this.http.post(`${this.apiUrl}/products/${productId}/upload`, formData);
    }

    getProductsByAisle(aisleId: number): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/products/aisle/${aisleId}`);
    }

    addProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product).pipe(
        tap(() => this.loadProducts()) // Esto es la clave: recarga la lista automáticamente
    );
}

    updateStock(productId: string, quantity: number, type: 'in' | 'out'): Observable<any> {
        return this.http.patch(`${this.apiUrl}/products/${productId}/stock`, {
            quantity: Math.abs(quantity),
            type
        });
    }

    // ==========================================
    // PASILLOS
    // ==========================================
    loadAisles(): void {
        this.http.get<Aisle[]>(`${this.apiUrl}/aisles`).subscribe(data => {
            this.aisles.set(data);
        });
    }

    // ==========================================
    // PROVEEDORES
    // ==========================================
    loadSuppliers(): void {
        this.http.get<Supplier[]>(`${this.apiUrl}/suppliers`).subscribe(data => {
            this.suppliers.set(data);
        });
    }

    // ==========================================
    // MOVIMIENTOS
    // ==========================================
    loadMovements(): void {
        this.http.get<StockMovement[]>(`${this.apiUrl}/movements`).subscribe(data => {
            //console.log('Movimientos cargados:', data);
            // Mapeamos los datos para que el frontend pueda leer el producto
            const mappedMovements = data.map((m: any) => {
                const productData = m.Product || m.product;
                return {
                    ...m,
                    product: productData || { name: 'Producto eliminado' }
                };
            });
            this.movements.set(mappedMovements);
        });
    }

    // ==========================================
    // CRUD DE PROVEEDORES
    // ==========================================
    createSupplier(supplier: Partial<Supplier>): Observable<Supplier> {
        return this.http.post<Supplier>(`${this.apiUrl}/suppliers`, supplier);
    }

    updateSupplier(id: string, supplier: Partial<Supplier>): Observable<Supplier> {
        return this.http.put<Supplier>(`${this.apiUrl}/suppliers/${id}`, supplier);
    }

    deleteSupplier(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/suppliers/${id}`);
    }

    
}