import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse, LoginRequest, SignUpRequest } from '../../../core/models';
import { environment } from '../../../../environments/environment';

/**
 * Serviço de Autenticação
 * Responsável por: login, signup, logout e gerenciamento de token
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'auth_token';
  private usernameKey = 'username';

  // Observável para rastrear estado de autenticação
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isTokenValid());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<string | null>(this.getStoredUsername());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkTokenValidity();
  }

  /**
   * Realiza login do utilizador
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  /**
   * Realiza registro de novo utilizador
   */
  signup(request: SignUpRequest): Observable<AuthResponse> {
    const { confirmPassword, ...signupData } = request;
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, signupData).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  /**
   * Realiza logout do utilizador
   */
  logout(): void {
    this.clearAuthData();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  /**
   * Retorna o token armazenado
   */
  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  /**
   * Retorna o username armazenado
   */
  getUsername(): string | null {
    return sessionStorage.getItem(this.usernameKey);
  }

  /**
   * Verifica se o utilizador está autenticado
   */
  isAuthenticated(): boolean {
    return this.isTokenValid();
  }

  /**
   * Manipula autenticação bem-sucedida
   */
  private handleAuthSuccess(response: AuthResponse): void {
    this.storeAuthData(response.token, response.username);
    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(response.username);
  }

  /**
   * Armazena dados de autenticação de forma segura (sessionStorage)
   */
  private storeAuthData(token: string, username: string): void {
    sessionStorage.setItem(this.tokenKey, token);
    sessionStorage.setItem(this.usernameKey, username);
  }

  /**
   * Limpa dados de autenticação
   */
  private clearAuthData(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.usernameKey);
  }

  /**
   * Obtém username armazenado
   */
  private getStoredUsername(): string | null {
    return sessionStorage.getItem(this.usernameKey);
  }

  /**
   * Valida se o token ainda é válido
   */
  private isTokenValid(): boolean {
    const token = sessionStorage.getItem(this.tokenKey);
    return !!token;
  }

  /**
   * Verifica validade do token periodicamente
   */
  private checkTokenValidity(): void {
    // Pode ser expandido para validar JWT expirado no futuro
    setInterval(() => {
      const isValid = this.isTokenValid();
      if (isValid !== this.isAuthenticatedSubject.value) {
        this.isAuthenticatedSubject.next(isValid);
      }
    }, 60000); // Verifica a cada minuto
  }
}
