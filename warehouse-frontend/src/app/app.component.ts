import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,                // <--- AGREGA ESTO (es lo más importante)
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []                       // Puedes dejar vacío o poner estilos aquí
})
export class AppComponent {}