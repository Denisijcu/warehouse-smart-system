import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-[#0A0C11] text-[#F0F1F5]">
      <h1 class="text-6xl font-bold text-[#FF6B00]">404</h1>
      <p class="text-xl mt-2">Página no encontrada</p>
      <a routerLink="/" class="mt-4 bg-[#10B981] px-6 py-2 rounded-lg text-sm font-bold text-white">Volver al inicio</a>
    </div>
  `
})
export class PageNotFoundComponent {}