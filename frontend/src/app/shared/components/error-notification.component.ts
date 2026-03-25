import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ErrorHandlingService, ErrorMessage } from '../../core/interceptors/error-handling.service';

/**
 * Componente de Notificação de Erro Global
 * Exibe erros HTTP e mensagens do sistema
 */
@Component({
  selector: 'app-error-notification',
  templateUrl: './error-notification.component.html',
  styleUrls: ['./error-notification.component.scss']
})
export class ErrorNotificationComponent implements OnInit, OnDestroy {
  currentError: ErrorMessage | null = null;
  private destroy$ = new Subject<void>();

  constructor(private errorHandler: ErrorHandlingService) {}

  ngOnInit(): void {
    this.subscribeToErrors();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Subscreve aos erros
   */
  private subscribeToErrors(): void {
    this.errorHandler.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        this.currentError = error;
        
        // Auto-remove erro após 5 segundos
        if (error) {
          setTimeout(() => {
            if (this.currentError === error) {
              this.currentError = null;
            }
          }, 5000);
        }
      });
  }

  /**
   * Limpa erro manualmente
   */
  dismissError(): void {
    this.currentError = null;
    this.errorHandler.clearError();
  }

  /**
   * Retorna classe CSS baseada no tipo de erro
   */
  getErrorClass(): string {
    if (!this.currentError) return '';
    return `notification-${this.currentError.type}`;
  }

  /**
   * Retorna ícone baseado no tipo de erro
   */
  getErrorIcon(): string {
    switch (this.currentError?.type) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  }
}
