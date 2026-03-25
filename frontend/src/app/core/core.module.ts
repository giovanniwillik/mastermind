import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AuthService } from '../modules/auth/services/auth.service';
import { ErrorHandlingService } from './interceptors/error-handling.service';

/**
 * Módulo Core
 * Contém serviços, interceptors e guards essenciais
 * Deve ser importado apenas uma vez na aplicação
 */
@NgModule({
  providers: [
    AuthService,
    ErrorHandlingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {}
