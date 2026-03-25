import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { GameRoutingModule } from './game-routing.module';
import { GamePlayComponent } from './components/game-play.component';
import { GameHistoryComponent } from './components/game-history.component';

/**
 * Módulo de Jogo
 * Encapsula componentes e funcionalidades de jogo
 */
@NgModule({
  declarations: [GamePlayComponent, GameHistoryComponent],
  imports: [CommonModule, ReactiveFormsModule, GameRoutingModule]
})
export class GameModule {}
