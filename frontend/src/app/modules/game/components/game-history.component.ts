import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameService } from '../services/game.service';
import { GameListResponse, GameDetailResponse } from '../../../core/models';

/**
 * Componente de Histórico de Jogos
 * Exibe lista de todos os jogos do jogador com opção de visualizar detalhes
 */
@Component({
  selector: 'app-game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.scss']
})
export class GameHistoryComponent implements OnInit, OnDestroy {
  games: GameListResponse[] = [];
  selectedGameDetail: GameDetailResponse | null = null;
  isLoading = false;
  isDetailLoading = false;
  hoveredColor: string | null = null;

  // Mapeamento de cores
  colorNames: { [key: string]: string } = {
    A: 'Vermelho',
    B: 'Verde',
    C: 'Azul',
    D: 'Amarelo',
    E: 'Laranja',
    F: 'Roxo'
  };

  private destroy$ = new Subject<void>();

  constructor(
    private gameService: GameService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGames();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carrega todos os jogos do jogador
   */
  private loadGames(): void {
    this.isLoading = true;
    this.gameService.getPlayerGames()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (games) => {
          this.games = games.sort((a, b) => 
            new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
          );
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  /**
   * Carrega detalhes de um jogo específico
   */
  loadGameDetail(gameCode: string): void {
    this.isDetailLoading = true;
    this.gameService.getGameDetail(gameCode)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (gameDetail) => {
          this.selectedGameDetail = gameDetail;
          this.isDetailLoading = false;
        },
        error: () => {
          this.isDetailLoading = false;
        }
      });
  }

  /**
   * Fecha o modal de detalhes
   */
  closeDetail(): void {
    this.selectedGameDetail = null;
  }

  /**
   * Formata a data para exibição
   */
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Retorna classe CSS baseada no status do jogo
   */
  getStatusClass(status: string): string {
    return status === 'WON' ? 'WON' : status === 'LOST' ? 'LOST' : 'IN_PROGRESS';
  }

  /**
   * Retorna texto de status traduzido
   */
  getStatusText(status: string): string {
    switch (status) {
      case 'WON': return '✅ Vitória';
      case 'LOST': return '❌ Derrota';
      case 'IN_PROGRESS': return '⏳ Em Progresso';
      default: return status;
    }
  }

  /**
   * Calcula a duração entre duas datas em formato legível
   */
  getGameDuration(startedAt: string, finishedAt: string | null | undefined): string {
    if (!finishedAt) return 'N/A';
    const start = new Date(startedAt).getTime();
    const finish = new Date(finishedAt).getTime();
    const durationMs = finish - start;
    const durationSeconds = Math.floor(durationMs / 1000);
    return this.getDurationText(durationSeconds);
  }

  /**
   * Formata segundos em formato legível (Xm Ys)
   */
  getDurationText(totalSeconds: number): string {
    if (totalSeconds === 0) return '0s';
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes === 0) return `${seconds}s`;
    if (seconds === 0) return `${minutes}m`;
    return `${minutes}m ${seconds}s`;
  }

  /**
   * Converte código de cor para nome descritivo
   */
  getColorDescription(color: string): string {
    return this.colorNames[color] || color;
  }

  /**
   * Retorna apenas a pontuação final do backend
   */
  calculateScore(game: GameDetailResponse): string {
    if (game.status === 'WON') {
      return String(game.finalScore || 0);
    }
    return '0';
  }

  /**
   * Formata o cálculo da pontuação para exibição em tooltip
   * Fórmula: (tentativas restantes × 100) + (1000 - duração em segundos), mínimo 100
   */
  formatScoreCalculation(game: GameDetailResponse): string {
    if (game.status === 'WON') {
      const attemptsRemaining = game.maxAttempts - game.currentAttempt;
      const baseScore = (attemptsRemaining * 100) + (1000 - (game.durationSeconds || 0));
      const finalScore = Math.max(baseScore, 100);
      return `(${attemptsRemaining} × 100) + (1000 - ${game.durationSeconds}s) = ${baseScore} → Pontuação Final: ${finalScore}`;
    }
    return 'Derrota: 0 pontos';
  }

  /**
   * Navega para o dashboard
   */
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Continua um jogo em progresso
   */
  playGame(gameCode: string): void {
    this.gameService.getGameDetail(gameCode)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/game/play']);
        }
      });
  }
}
