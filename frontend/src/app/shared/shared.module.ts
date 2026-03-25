import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard.component';
import { ErrorNotificationComponent } from './components/error-notification.component';

/**
 * Módulo Shared
 * Contém componentes e serviços reutilizáveis em toda a aplicação
 */
@NgModule({
  declarations: [DashboardComponent, ErrorNotificationComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [DashboardComponent, ErrorNotificationComponent]
})
export class SharedModule {}
