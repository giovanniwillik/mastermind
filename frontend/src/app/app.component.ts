import { Component } from '@angular/core';

/**
 * Componente Principal da Aplicação
 * Serve como contêiner para rotas e componente de notificação de erros
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Mastermind Game';
}
