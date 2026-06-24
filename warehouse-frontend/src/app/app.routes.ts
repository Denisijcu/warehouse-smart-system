import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './core/layout/layout.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
                pathMatch: 'full'
            },
            {
                path: 'usuarios',
                loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent)
            },
            {
                path: 'inventory',
                loadComponent: () => import('./features/inventory/inventory.component').then(m => m.InventoryComponent)
            },
            {
                path: 'movements',
                loadComponent: () => import('./features/movements/movements.component').then(m => m.MovementsComponent)
            },
            {
                path: 'suppliers',
                loadComponent: () => import('./features/suppliers/suppliers.component').then(m => m.SuppliersComponent)
            },
            {
                path: 'reports',
                loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
            },
            {
                path: 'store',
                loadComponent: () => import('./features/store/store.component').then(m => m.StoreComponent),
                canActivate: [authGuard]
            },
            {
                path: 'product/:id',
                loadComponent: () => import('./features/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
                canActivate: [authGuard]
            },
            {
                path: 'pasillos',
                loadComponent: () => import('./features/aisles/aisles.component').then(m => m.AislesComponent)
            },
            // 🛡️ Módulo de IA Asistente integrado

            {
                path: 'ai-asistente',
                loadComponent: () => import('./features/ai-assistant/ai-assistant.component').then(m => m.AiAssistantComponent)
            },
            {
                path: 'alertas',
                loadComponent: () => import('./features/alerts/alerts.component').then(m => m.AlertsComponent)
            },
            {
                path: 'configuracion',
                loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
            },
            // 🛡️ RUTA 404 COMODÍN (Debe ir al final de todo)
            {
                path: '**',
                loadComponent: () => import('./features/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)
            }

        ]
    }
];