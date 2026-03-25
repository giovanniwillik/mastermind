import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RankingResponse } from '../../../core/models';
import { environment } from '../../../../environments/environment';

/**
 * Serviço de Ranking
 * Responsável por obter dados de ranking dos jogadores
 */
@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private apiUrl = `${environment.apiUrl}/ranking`;

  constructor(private http: HttpClient) {}

  /**
   * Obtém ranking dos melhores jogadores
   * @param limit Número máximo de jogadores a retornar (padrão: 10)
   */
  getRanking(limit: number = 10): Observable<RankingResponse[]> {
    return this.http.get<RankingResponse[]>(`${this.apiUrl}`, {
      params: { limit: limit.toString() }
    });
  }

  /**
   * Obtém top 10 jogadores (atalho)
   */
  getTopPlayers(): Observable<RankingResponse[]> {
    return this.getRanking(10);
  }
}
