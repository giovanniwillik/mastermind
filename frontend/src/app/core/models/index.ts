/**
 * Modelos/Interfaces da aplicação Mastermind
 * Correspondem aos DTOs do backend
 */

/**
 * Modelos de Autenticação
 */
export interface AuthResponse {
  token: string;
  username: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

/**
 * Modelos de Jogo
 */
export interface StartGameResponse {
  gameCode: string;
  status: GameStatus;
  currentAttempt: number;
  maxAttempts: number;
}

export interface GameListResponse {
  gameCode: string;
  status: GameStatus;
  currentAttempt: number;
  maxAttempts: number;
  startedAt: string;
  finishedAt?: string;
}

export interface GameDetailResponse {
  gameCode: string;
  status: GameStatus;
  expectedCode: string;
  finalScore?: number;
  durationSeconds?: number;
  currentAttempt: number;
  maxAttempts: number;
  startedAt: string;
  finishedAt?: string;
  attempts: AttemptResponse[];
}

export interface AttemptResponse {
  attemptNumber: number;
  guess: string;
  exactMatches: number;
  partialMatches: number;
  createdAt: string;
}

export interface GuessRequest {
  guess: string;
}

export interface GuessResponse {
  attemptNumber: number;
  guess: string;
  exactMatches: number;
  partialMatches: number;
  status: GameStatus;
  finalScore?: number;
  durationSeconds?: number;
}

/**
 * Modelos de Ranking
 */
export interface RankingResponse {
  username: string;
  bestScore: number;
  totalGames: number;
  averageDuration: number;
}

/**
 * Status do Jogo
 */
export type GameStatus = 'IN_PROGRESS' | 'WON' | 'LOST';

/**
 * Estado da Aplicação
 */
export interface AppState {
  isAuthenticated: boolean;
  currentUser?: string;
  currentGameCode?: string;
}
