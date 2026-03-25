import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login.component';
import { SignupComponent } from './components/signup.component';

/**
 * Módulo de Autenticação
 * Encapsula componentes e funcionalidades de login e signup
 */
@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [CommonModule, ReactiveFormsModule, AuthRoutingModule]
})
export class AuthModule {}
