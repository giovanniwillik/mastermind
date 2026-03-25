import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameService } from '../services/game.service';
import { GameDetailResponse, GameStatus } from '../../../core/models';
import { ErrorHandlingService } from '../../../core/interceptors/error-handling.service';

/**
 * Componente Principal do Jogo Mastermind
 * Gerencia a lógica de interface do jogo, renderiza matriz de tentativas
 * Não conhece a combinação correta - segurança é responsabilidade do backend
 */
@Component({
  selector: 'app-game-play',
  templateUrl: './game-play.component.html',
  styleUrls: ['./game-play.component.scss']
})
export class GamePlayComponent implements OnInit, OnDestroy {
  currentGame: GameDetailResponse | null = null;
  guessForm!: FormGroup;
  isSubmitting = false;
  gameStatus: GameStatus | null = null;
  progressPercentage = 0;

  private destroy$ = new Subject<void>();

  // Cores válidas para Mastermind (6 cores)
  // A=Vermelho, B=Verde, C=Azul, D=Amarelo, E=Laranja, F=Roxo
  validColors = ['A', 'B', 'C', 'D', 'E', 'F'];
  colorNames: { [key: string]: string } = {
    A: 'Vermelho',
    B: 'Verde',
    C: 'Azul',
    D: 'Amarelo',
    E: 'Laranja',
    F: 'Roxo'
  };

  constructor(
    private gameService: GameService,
    private formBuilder: FormBuilder,
    private router: Router,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.subscribeToGameUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inicializa o formulário da tentativa
   */
  private initializeForm(): void {
    this.guessForm = this.formBuilder.group({
      guess: ['', [
        Validators.required,
        Validators.pattern(/^[ABCDEF]{4}$/),
        Validators.minLength(4),
        Validators.maxLength(4)
      ]]
    });
  }

  /**
   * Subscreve aos updates do jogo
   */
  private subscribeToGameUpdates(): void {
    this.gameService.currentGame$
      .pipe(takeUntil(this.destroy$))
      .subscribe(game => {
        if (game) {
          this.currentGame = game;
          this.gameStatus = game.status as GameStatus;
          this.updateProgressPercentage();

          // Desabilita entrada se jogo terminou
          if (this.isGameFinished()) {
            this.guessForm.disable();
          }
        }
      });
  }

  /**
   * Submete uma nova tentativa
   */
  onSubmitGuess(): void {
    if (this.guessForm.invalid || this.isSubmitting || !this.currentGame) {
      return;
    }

    this.isSubmitting = true;
    const guess = this.guessForm.get('guess')?.value.toUpperCase();

    this.gameService.submitGuess(this.currentGame.gameCode, guess)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.guessForm.reset();
          this.guessForm.get('guess')?.enable();

          // Se jogo terminou, mostra mensagem
          if (response.status !== 'IN_PROGRESS') {
            this.handleGameEnd(response.status);
          }
        },
        error: (error) => {
          this.isSubmitting = false;
        }
      });
  }

  /**
   * Limpa a entrada do formulário
   */
  clearGuess(): void {
    this.guessForm.reset();
  }

  /**
   * Retorna para o dashboard
   */
  goToDashboard(): void {
    this.gameService.clearCurrentGame();
    this.router.navigate(['/dashboard']);
  }

  /**
   * Verifica se o jogo terminou
   */
  isGameFinished(): boolean {
    return this.gameStatus === 'WON' || this.gameStatus === 'LOST';
  }

  /**
   * Trata o fim do jogo
   */
  private handleGameEnd(status: GameStatus): void {
    if (status === 'WON') {
      this.errorHandler.showInfo('🎉 Parabéns! Você adivinhou a combinação!');
    } else if (status === 'LOST') {
      this.errorHandler.showInfo(`😔 Fim do jogo! Você atingiu o máximo de ${this.currentGame?.maxAttempts} tentativas.`);
    }
  }

  /**
   * Atualiza percentual de progresso
   */
  private updateProgressPercentage(): void {
    if (this.currentGame) {
      this.progressPercentage = (this.currentGame.currentAttempt / this.currentGame.maxAttempts) * 100;
    }
  }

  /**
   * Retorna um array para iterar sobre as linhas vazias restantes
   */
  getEmptyRowsCount(): number[] {
    if (!this.currentGame) return [];
    
    const completedAndCurrent = (this.currentGame.attempts?.length || 0) + (!this.isGameFinished() ? 1 : 0);
    const remaining = (this.currentGame.maxAttempts || 10) - completedAndCurrent;
    
    return Array.from({ length: Math.max(0, remaining) }, (_, i) => i);
  }

  /**
   * Getter para acesso aos controles do formulário
   */
  get f() {
    return this.guessForm.controls;
  }

  /**
   * Adiciona cor ao campo de entrada (representação visual)
   */
  addColorToGuess(color: string): void {
    const currentValue = this.guessForm.get('guess')?.value || '';
    if (currentValue.length < 4) {
      this.guessForm.get('guess')?.setValue(currentValue + color);
    }
  }

  /**
   * Remove última cor do campo de entrada
   */
  removeLastColor(): void {
    const currentValue = this.guessForm.get('guess')?.value || '';
    if (currentValue.length > 0) {
      this.guessForm.get('guess')?.setValue(currentValue.slice(0, -1));
    }
  }
}
