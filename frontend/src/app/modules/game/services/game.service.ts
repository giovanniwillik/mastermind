import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  GameDetailResponse,
  GameListResponse,
  GuessRequest,
  GuessResponse,
  StartGameResponse
} from '../../../core/models';
import { environment } from '../../../../environments/environment';

/**
 * Serviço de Jogo
 * Responsável por toda a comunicação com a API relacionada a jogos
 */
@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = `${environment.apiUrl}/games`;

  // Estado atual do jogo
  private currentGameSubject = new BehaviorSubject<GameDetailResponse | null>(null);
  public currentGame$ = this.currentGameSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Inicia um novo jogo
   */
  startGame(): Observable<StartGameResponse> {
    return this.http.post<StartGameResponse>(`${this.apiUrl}/start`, {}).pipe(
      tap(response => {
        // Busca detalhes completos do jogo iniciado
        this.getGameDetail(response.gameCode).subscribe(
          gameDetail => this.currentGameSubject.next(gameDetail)
        );
      })
    );
  }

  /**
   * Obtém lista de todos os jogos do jogador
   */
  getPlayerGames(): Observable<GameListResponse[]> {
    return this.http.get<GameListResponse[]>(`${this.apiUrl}`);
  }

  /**
   * Obtém detalhes completos de um jogo específico
   */
  getGameDetail(gameCode: string): Observable<GameDetailResponse> {
    return this.http.get<GameDetailResponse>(`${this.apiUrl}/${gameCode}`).pipe(
      tap(gameDetail => this.currentGameSubject.next(gameDetail))
    );
  }

  /**
   * Submete uma tentativa (guess) no jogo
   */
  submitGuess(gameCode: string, guess: string): Observable<GuessResponse> {
    const request: GuessRequest = { guess };
    return this.http.post<GuessResponse>(`${this.apiUrl}/${gameCode}/guess`, request).pipe(
      tap(response => {
        // Atualiza jogo atual com nova tentativa
        this.getGameDetail(gameCode).subscribe(
          gameDetail => this.currentGameSubject.next(gameDetail)
        );
      })
    );
  }

  /**
   * Obtém jogo atual do estado
   */
  getCurrentGame(): GameDetailResponse | null {
    return this.currentGameSubject.value;
  }

  /**
   * Limpa estado do jogo atual
   */
  clearCurrentGame(): void {
    this.currentGameSubject.next(null);
  }
}
