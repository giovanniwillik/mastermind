import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../modules/auth/services/auth.service';
import { GameService } from '../../modules/game/services/game.service';
import { GameListResponse } from '../../core/models';

/**
 * Componente Dashboard
 * Página principal após login com navegação e opções de iniciar novo jogo
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUsername: string | null = null;
  recentGames: GameListResponse[] = [];
  isLoadingGames = false;
  isStartingGame = false;
  showMenu = false;
  showRulesModal = false;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private gameService: GameService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscribeToUser();
    this.loadRecentGames();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Subscreve ao usuário atual
   */
  private subscribeToUser(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUsername = user;
      });
  }

  /**
   * Carrega jogos recentes do jogador
   */
  private loadRecentGames(): void {
    this.isLoadingGames = true;
    this.gameService.getPlayerGames()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (games) => {
          // Ordena por data decrescente e pega os 3 últimos
          this.recentGames = games
            .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
            .slice(0, 3);
          this.isLoadingGames = false;
        },
        error: () => {
          this.isLoadingGames = false;
        }
      });
  }

  /**
   * Inicia um novo jogo
   */
  startNewGame(): void {
    this.isStartingGame = true;
    this.gameService.startGame()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isStartingGame = false;
          this.router.navigate(['/game/play']);
        },
        error: () => {
          this.isStartingGame = false;
        }
      });
  }

  /**
   * Continua um jogo em progresso
   */
  continueGame(gameCode: string): void {
    this.gameService.getGameDetail(gameCode).subscribe({
      next: () => {
        this.router.navigate(['/game/play']);
      }
    });
  }

  /**
   * Navega para o ranking
   */
  navigateToRanking(): void {
    this.router.navigate(['/ranking']);
    this.showMenu = false;
  }

  /**
   * Navega para o histórico de jogos
   */
  navigateToHistory(): void {
    this.router.navigate(['/game/history']);
    this.showMenu = false;
  }

  /**
   * Realiza logout
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  /**
   * Alterna visibilidade do menu
   */
  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  /**
   * Fecha a modal de regras
   */
  closeRulesModal(): void {
    this.showRulesModal = false;
  }

  /**
   * Retorna status formatado
   */
  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'WON': '✅ Vitória',
      'LOST': '❌ Derrota',
      'IN_PROGRESS': '⏳ Em Progresso'
    };
    return statusMap[status] || status;
  }

  /**
   * Retorna classe CSS do status
   */
  getStatusClass(status: string): string {
    return 'status-' + status.toLowerCase();
  }
}
