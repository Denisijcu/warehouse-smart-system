export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  quantity: number;
  minStock: number;
  price: number;
  sectionId: number;
  supplierId: string;
  section?: Section;
  supplier?: Supplier;
  targetAisleId?: number;
  categoryId?: number;
  imageUrl?: string;
  category?: Category;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Aisle {
  id: number;
  name: string;
  description?: string;
  sections?: Section[];
}

export interface Section {
  id: number;
  name: string;
  aisleId: number;
  aisle?: Aisle;          // <--- AHORA USA LA INTERFAZ Aisle, NO un objeto anónimo
  products?: Product[];
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  quantity: number;
  type: 'in' | 'out' | 'adjustment';
  reason?: string;
  userId: string;
  createdAt: Date;
  product?: Product;
  user?: { id: string; name: string; email: string };
}