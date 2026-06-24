import { Component, inject, signal, viewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InventoryService } from '../../core/services/inventory.service';
import { environment } from '../../../environments/environment';

const API = environment.aiServiceUrl || environment.apiUrl;

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="flex flex-col h-full bg-[#0C0E14] overflow-hidden">
    <div class="p-6 border-b border-[#252836]">
      <h1 class="text-xl font-bold text-[#F0F1F5]">Asistente Inteligente</h1>
      <p class="text-[10px] text-[#7C8196]">Vertex Intelligence Core activo</p>
    </div>

    <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar" #scrollBottom>
      @for (msg of messages(); track $index) {
        <div [class]="msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'">
          <div [class]="msg.role === 'user' ? 'bg-[#FF6B00] text-white' : 'bg-[#151820] border border-[#252836] text-[#F0F1F5]'"
               class="max-w-[80%] p-3 rounded-2xl text-xs shadow-lg"
               [innerHTML]="formatMessage(msg.content)">
          </div>
        </div>
      }
    </div>

    <div class="p-6 border-t border-[#252836] bg-[#0C0E14]">
      <div class="flex flex-wrap gap-2 mb-4 justify-center">
        @for (tag of suggestions; track tag) {
          <button (click)="sendMessage(tag)" 
                  class="bg-[#151820] border border-[#252836] text-[#7C8196] hover:text-[#FF6B00] px-3 py-1.5 rounded-lg text-[10px] transition-all">
            {{ tag }}
          </button>
        }
      </div>

      <div class="relative w-full max-w-3xl mx-auto">
        <input type="text" [(ngModel)]="userQuery" (keyup.enter)="sendMessage()" 
               class="w-full bg-[#151820] border border-[#252836] text-[#F0F1F5] text-xs rounded-xl p-4 outline-none focus:border-[#FF6B00]" 
               placeholder="Escribe tu consulta...">
      </div>
    </div>
  </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #252836; border-radius: 2px; }
  `]
})
export class AiAssistantComponent implements AfterViewChecked {
  private readonly http = inject(HttpClient);
  inventoryService = inject(InventoryService);
  
  userQuery = signal('');
  messages = signal<{role: 'user'|'ai', content: string}[]>([
    { role: 'ai', content: 'Soy tu Asistente Inteligente de Warehouse AI. ¿Qué necesitas saber sobre el inventario?' }
  ]);
  
  suggestions = ['Taladros disponibles', 'Stock bajo', '¿Dónde están las pinturas?', 'Info de proveedores'];
  scrollBottom = viewChild<ElementRef>('scrollBottom');

  ngAfterViewChecked() { this.scrollToBottom(); }

  sendMessage(query?: string) {
    const q = query || this.userQuery();
    if (!q.trim()) return;

    this.messages.update(m => [...m, { role: 'user', content: q }]);
    this.userQuery.set('');

    // Comunicación con el backend real
    this.http.post<{reply: string}>(`${API}/chat`, { message: q })
      .subscribe((res: {reply: string}) => {
        this.messages.update(m => [...m, { role: 'ai', content: res.reply }]);
      });
  }

  formatMessage(content: string): string {
    return content
      // Tablas básicas
      .replace(/\| (.*) \|/g, '<table class="w-full text-[10px] border-collapse border border-[#252836] my-2"><tr>$1</tr></table>')
      // Negritas
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#FF6B00]">$1</strong>')
      // Listas
      .replace(/- (.*)/g, '<li class="ml-4 text-[11px]">$1</li>')
      // Saltos de línea
      .replace(/\n/g, '<br>');
  }

  private scrollToBottom() {
    const el = this.scrollBottom()?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }
}