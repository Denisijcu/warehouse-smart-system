import { Component, inject, signal, computed, OnInit, ElementRef, viewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { InventoryService } from '../../core/services/inventory.service';
import * as THREE from 'three';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  template: `
    @if (product()) {
      <div class="flex items-center gap-2 text-xs text-[#7C8196] mb-6 flex-wrap">
        <a routerLink="/pasillos" class="hover:text-[#FF6B00] no-underline transition-colors">Pasillos</a>
        <i class="fas fa-chevron-right text-[9px]"></i>
        <a [routerLink]="['/inventory']" [queryParams]="{ aisle: product().targetAisleId }" class="hover:text-[#FF6B00] no-underline transition-colors">
          Pasillo {{ product().targetAisleId || '1' }}
        </a>
        <i class="fas fa-chevron-right text-[9px]"></i>
        <span class="text-[#F0F1F5] truncate font-medium">{{ product().name }}</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        <div class="lg:col-span-3 space-y-4">
          <div class="relative bg-[#0A0C11] border border-[#252836] rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center group">
            
            @if (viewMode() === 'gallery') {
              <img [src]="activeImage()" class="w-full h-full object-contain" [alt]="product().name">
            } @else {
              <div #threeContainer class="w-full h-full cursor-grab active:cursor-grabbing"></div>
            }

            @if (has3DModel()) {
              <button (click)="toggle3D()" 
                      class="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md border border-[#252836] hover:border-[#FF6B00] text-white hover:text-[#FF6B00] px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 z-20 shadow-xl">
                <i class="fas" [ngClass]="viewMode() === 'gallery' ? 'fa-cube' : 'fa-images'"></i>
                {{ viewMode() === 'gallery' ? 'Ver en 3D' : 'Ver Galería' }}
              </button>
            }
          </div>

          <div class="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            @for (img of productImages(); track img.url) {
              <button (click)="selectImage(img.url)"
                      class="w-20 h-20 rounded-xl border-2 overflow-hidden bg-[#0A0C11] transition-all flex-shrink-0"
                      [ngClass]="activeImage() === img.url && viewMode() === 'gallery' ? 'border-[#FF6B00] opacity-100' : 'border-[#252836] opacity-50 hover:opacity-80'">
                <img [src]="img.url" class="w-full h-full object-cover" alt="Miniatura">
              </button>
            }
          </div>
        </div>

        <div class="lg:col-span-2 space-y-5">
          <div>
            <div class="flex flex-wrap gap-1.5 mb-2">
              @if (product().quantity <= product().minStock) {
                <span class="bg-[#EF4444]/15 text-[#EF4444] text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider border border-[#EF4444]/10">Stock Bajo</span>
              }
              @if (product().tags?.includes('bestseller')) {
                <span class="bg-[#FF6B00]/15 text-[#FF6B00] text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider border border-[#FF6B00]/10">Bestseller</span>
              }
            </div>
            <h1 class="font-sans text-2xl font-bold text-[#F0F1F5] leading-snug">{{ product().name }}</h1>
            <p class="text-xs text-[#7C8196] mt-1">
              SKU: <span class="font-mono text-white/80">{{ product().sku }}</span> · Ubicación: P-{{ product().targetAisleId || '1' }}
            </p>
          </div>

          <div class="text-3xl font-black text-[#FF6B00]">
            {{ product().price | currency:'USD':'symbol':'1.2-2' }}
          </div>

          <div class="bg-[#151820] border border-[#252836] rounded-xl p-4">
            <div class="flex justify-between text-xs mb-2">
              <span class="text-[#7C8196]">Disponibilidad en Almacén</span>
              <span class="font-bold" [style.color]="stockColor()">{{ product().quantity }} unidades</span>
            </div>
            <div class="w-full h-1.5 bg-[#252836] rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500" 
                   [style.width.%]="stockPercentage()" 
                   [style.backgroundColor]="stockColor()"></div>
            </div>
            <div class="text-[10px] text-[#7C8196] mt-2 flex justify-between">
              <span>Mínimo requerido: {{ product().minStock || 5 }} uds</span>
              <span>Estado: {{ product().quantity <= product().minStock ? 'Crítico' : 'Estable' }}</span>
            </div>
          </div>

          <div class="bg-[#151820] border border-[#252836] rounded-xl p-4 flex items-center justify-between">
            <div>
              <span class="text-[9px] uppercase tracking-wider text-[#7C8196] block mb-0.5">Proveedor Oficial</span>
              <span class="text-sm font-medium text-[#F0F1F5]">{{ product().Supplier?.name || product().supplier?.name || 'Proveedor XYZ' }}</span>
            </div>
            <i class="fas fa-truck-field text-[#7C8196] text-sm"></i>
          </div>

          <div class="border-b border-[#252836]">
            <div class="flex gap-2">
              @for (tab of [{id:'info', l:'Información'}, {id:'specs', l:'Especificaciones'}]; track tab.id) {
                <button (click)="activeTab.set(tab.id)"
                        class="pb-3 text-xs font-bold transition-all border-b-2 bg-transparent outline-none cursor-pointer"
                        [ngClass]="activeTab() === tab.id ? 'text-[#FF6B00] border-[#FF6B00]' : 'text-[#7C8196] border-transparent hover:text-[#F0F1F5]'">
                  {{ tab.l }}
                </button>
              }
            </div>
          </div>

          <div class="text-xs leading-relaxed text-[#7C8196]">
            @if (activeTab() === 'info') {
              <p class="text-sm bg-[#151820]/40 p-4 border border-[#252836]/60 rounded-xl">
                {{ product().description || 'Sin descripción detallada registrada para este artículo.' }}
              </p>
            } @else {
              <div class="bg-[#151820] border border-[#252836] rounded-xl overflow-hidden font-sans">
                <div class="flex justify-between p-3 border-b border-[#252836]/50">
                  <span>Código de Control</span>
                  <span class="text-[#F0F1F5] font-mono">{{ product().sku }}</span>
                </div>
                <div class="flex justify-between p-3 border-b border-[#252836]/50 bg-[#0C0E14]/30">
                  <span>Identificador Interno</span>
                  <span class="text-[#F0F1F5] font-mono">{{ product().id }}</span>
                </div>
                <div class="flex justify-between p-3">
                  <span>Estatus Operativo</span>
                  <span class="text-[#10B981] font-bold">ACTIVO</span>
                </div>
              </div>
            }
          </div>

        </div>
      </div>
    } @else {
      <div class="py-20 text-center text-[#7C8196]">
        <i class="fas fa-circle-notch fa-spin text-2xl mb-3 text-[#FF6B00]"></i>
        <p class="text-sm">Localizando información del producto en el núcleo...</p>
      </div>
    }
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { height: 5px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #252836; border-radius: 3px; }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private inventoryService = inject(InventoryService);

  // 🛡️ Tus Signals originales intactas
  product = signal<any>(null);
  productImages = signal<any[]>([]);
  activeImage = signal<string>('');
  viewMode = signal<'gallery' | '3d'>('gallery');
  has3DModel = signal<boolean>(false);
  activeTab = signal<string>('info');

  // Visor 3D Three.js Element Ref
  threeContainer = viewChild<ElementRef>('threeContainer');
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private renderer?: THREE.WebGLRenderer;

  // Lógica computada para la barra de progreso de stock
  stockPercentage = computed(() => {
    const p = this.product();
    if (!p) return 0;
    const min = p.minStock || 5;
    return Math.min(100, Math.round((p.quantity / (min * 4)) * 100));
  });

  stockColor = computed(() => {
    const p = this.product();
    if (!p) return '#7C8196';
    return p.quantity <= (p.minStock || 5) ? '#EF4444' : (this.stockPercentage() > 50 ? '#10B981' : '#F59E0B');
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Intentar buscar el producto de la señal del servicio
      const found = this.inventoryService.products().find(p => String(p.id) === id);
      if (found) {
        this.setupProduct(found);
      } else {
        // Fallback por si entran directo refrescando la página
        this.inventoryService.loadProducts();
        // Escuchar cambios hasta que carguen
        const checkInterval = setInterval(() => {
          const retryFound = this.inventoryService.products().find(p => String(p.id) === id);
          if (retryFound) {
            this.setupProduct(retryFound);
            clearInterval(checkInterval);
          }
        }, 100);
      }
    }
  }

  private setupProduct(prod: any) {
    this.product.set(prod);
    this.loadProductImages(prod);
    
    // Si tu lógica detecta un archivo 3D o simulación, actívalo
    if (prod.sku?.startsWith('HERR') || prod.hasModel) {
      this.has3DModel.set(true);
    }
  }

  loadProductImages(prod: any) {
    // Buscar el array de imágenes
    const imagesArray = prod.ProductImages || prod.productImages || prod.images || [];
    
    if (imagesArray.length > 0) {
      // ✅ CORRECCIÓN: Usar 'imageUrl' en lugar de 'url'
      const mapped = imagesArray.map((img: any) => ({
        url: img.imageUrl || img.url
      }));
      this.productImages.set(mapped);
      this.activeImage.set(mapped[0].url);
    } else {
      // Fallback estético
      const fallbackUrl = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&h=450&fit=crop';
      this.productImages.set([{ url: fallbackUrl }]);
      this.activeImage.set(fallbackUrl);
    }
  }

  selectImage(url: string) {
    this.activeImage.set(url);
    this.viewMode.set('gallery');
  }

  toggle3D() {
    if (this.viewMode() === 'gallery') {
      this.viewMode.set('3d');
      // Esperar al siguiente ciclo de renderizado para inicializar Three.js
      setTimeout(() => this.initThreeJS(), 50);
    } else {
      this.viewMode.set('gallery');
    }
  }

  // 🛡️ Tu motor gráfico de simulación Three.js encapsulado
  private initThreeJS() {
    const container = this.threeContainer()?.nativeElement;
    if (!container) return;

    // Limpiar renders anteriores si existen
    container.innerHTML = '';

    const width = container.clientWidth;
    const height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // Luz táctica de ingeniería
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xff6b00, 1.5); // Acento naranja corporativo
    dirLight.position.set(5, 5, 5);
    this.scene.add(dirLight);

    // Cubo/Prisma de simulación de volumen de la caja del producto
    const geometry = new THREE.BoxGeometry(2, 1.5, 1);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x1c1f2b, 
      roughness: 0.4,
      metalness: 0.2,
      wireframe: false 
    });
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);

    // Alambres de diseño técnico (Wireframe overlay)
    const wireGeo = new THREE.EdgesGeometry(geometry);
    const wireMat = new THREE.LineBasicMaterial({ color: 0xff6b00 });
    const wireframe = new THREE.LineSegments(wireGeo, wireMat);
    mesh.add(wireframe);

    const animate = () => {
      if (this.viewMode() !== '3d') return;
      requestAnimationFrame(animate);

      mesh.rotation.y += 0.008;
      mesh.rotation.x += 0.003;

      this.renderer?.render(this.scene!, this.camera!);
    };

    animate();

    // Listener de redimensión dinámico
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !this.renderer || !this.camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
    resizeObserver.observe(container);
  }
}