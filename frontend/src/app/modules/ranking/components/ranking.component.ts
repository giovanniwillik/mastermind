import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RankingService } from '../services/ranking.service';
import { RankingResponse } from '../../../core/models';

/**
 * Componente de Ranking
 * Exibe o ranking dos melhores jogadores
 */
@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit, OnDestroy {
  rankings: RankingResponse[] = [];
  isLoading = false;
  selectedLimit = 10;
  limitOptions = [5, 10, 20, 50];

  private destroy$ = new Subject<void>();

  constructor(
    private rankingService: RankingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRanking();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carrega dados de ranking
   */
  private loadRanking(): void {
    this.isLoading = true;
    this.rankingService.getRanking(this.selectedLimit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rankings) => {
          this.rankings = rankings;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  /**
   * Atualiza limite de exibição
   */
  onLimitChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const limit = Number(target.value);
    this.selectedLimit = limit;
    this.loadRanking();
  }

  /**
   * Formata a duração média
   */
  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs.toFixed(0)}s`;
  }

  /**
   * Retorna o ícone/medalha baseado na posição
   */
  getMedalIcon(position: number): string {
    switch (position) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return position.toString();
    }
  }

  /**
   * Retorna classe CSS para a linha de ranking
   */
  getRankingRowClass(position: number): string {
    if (position === 1) return 'ranking-gold';
    if (position === 2) return 'ranking-silver';
    if (position === 3) return 'ranking-bronze';
    return '';
  }

  /**
   * Retorna ao dashboard
   */
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
