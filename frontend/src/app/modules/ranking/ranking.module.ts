import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingRoutingModule } from './ranking-routing.module';
import { RankingComponent } from './components/ranking.component';

/**
 * Módulo de Ranking
 * Encapsula componentes e funcionalidades de ranking
 */
@NgModule({
  declarations: [RankingComponent],
  imports: [CommonModule, RankingRoutingModule]
})
export class RankingModule {}
