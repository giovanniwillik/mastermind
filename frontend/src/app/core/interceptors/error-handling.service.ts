import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Interface para mensagens de erro
 */
export interface ErrorMessage {
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
}

/**
 * Serviço de Tratamento de Erros HTTP
 * Centraliza o tratamento de erros e fornece feedback visual ao usuário
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  private errorSubject = new BehaviorSubject<ErrorMessage | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor() {}

  /**
   * Trata erro HTTP e emite mensagem apropriada
   */
  handleError(error: HttpErrorResponse): void {
    let message = 'Ocorreu um erro. Tente novamente.';

    if (error.status === 0) {
      message = 'Erro de conexão. Verifique sua conexão de internet.';
    } else if (error.status === 400) {
      message = error.error?.message || 'Requisição inválida.';
    } else if (error.status === 401) {
      message = 'Não autorizado. Faça login novamente.';
    } else if (error.status === 403) {
      message = 'Acesso negado.';
    } else if (error.status === 404) {
      message = 'Recurso não encontrado.';
    } else if (error.status === 409) {
      message = error.error?.message || 'Conflito na requisição.';
    } else if (error.status === 500) {
      message = 'Erro no servidor. Tente mais tarde.';
    } else if (error.status === 503) {
      message = 'Serviço indisponível. Tente mais tarde.';
    }

    this.showError(message);
  }

  /**
   * Mostra mensagem de erro
   */
  showError(message: string): void {
    this.errorSubject.next({
      message,
      type: 'error',
      timestamp: new Date()
    });
  }

  /**
   * Mostra mensagem de aviso
   */
  showWarning(message: string): void {
    this.errorSubject.next({
      message,
      type: 'warning',
      timestamp: new Date()
    });
  }

  /**
   * Mostra mensagem de informação
   */
  showInfo(message: string): void {
    this.errorSubject.next({
      message,
      type: 'info',
      timestamp: new Date()
    });
  }

  /**
   * Limpa mensagem de erro
   */
  clearError(): void {
    this.errorSubject.next(null);
  }
}
