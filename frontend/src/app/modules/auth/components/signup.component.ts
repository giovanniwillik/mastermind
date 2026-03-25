import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ErrorHandlingService } from '../../../core/interceptors/error-handling.service';

/**
 * Componente de Signup
 * Formulário reativo com validações de senhas e confirmação
 */
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Inicializa formulário reativo com validação customizada
   */
  private initializeForm(): void {
    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * Validador customizado para verificar se as senhas coincidem
   */
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  /**
   * Submete o formulário de signup
   */
  onSubmit(): void {
    if (this.signupForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    const { username, email, password, confirmPassword } = this.signupForm.value;

    this.authService.signup({ username, email, password, confirmPassword }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        // Erro já foi tratado pelo interceptor
      }
    });
  }

  /**
   * Getter para facilitar acesso aos controles no template
   */
  get f() {
    return this.signupForm.controls;
  }

  /**
   * Verifica se as senhas não coincidem
   */
  get passwordMismatch(): boolean {
    return this.signupForm.errors?.['passwordMismatch'] && this.f['confirmPassword'].touched;
  }

  /**
   * Navega para página de login
   */
  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
