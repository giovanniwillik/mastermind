# Mastermind Frontend - Guia de Arquitetura

## 📐 Visão Geral da Arquitetura

A aplicação segue princípios SOLID e padrões Angular modernos com separação clara de responsabilidades em 4 camadas principais.

```
┌─────────────────────────────────────────┐
│         APP (Root Component)            │
├─────────────────────────────────────────┤
│    Error Notification (Global)          │
│    Router Outlet (Dynamic Content)      │
├─────────────────────────────────────────┤
│          SHARED Module                  │
│  ┌───────────────────────────────────┐  │
│  │ Dashboard | Error Notifications   │  │
│  │ Componentes Reutilizáveis         │  │
│  └───────────────────────────────────┘  │
├─────────────────────────────────────────┤
│       Feature Modules (Lazy Load)       │
│  ┌─────────────┬────────────┬────────┐  │
│  │ Auth Module │Game Module │Ranking │  │
│  │             │            │Module  │  │
│  └─────────────┴────────────┴────────┘  │
├─────────────────────────────────────────┤
│           CORE Module                   │
│  ┌──────────────────────────────────┐   │
│  │ Services, Guards, Interceptors   │   │
│  │ Models/Interfaces                │   │
│  └──────────────────────────────────┘   │
├─────────────────────────────────────────┤
│      HTTP Client + API Backend           │
└─────────────────────────────────────────┘
```

## 🏛️  Camadas e Responsabilidades

### 1. **Core Module** (`core/`)
Importado UMA ÚNICA VEZ no `AppModule`. Contém:

- **Modelos** (`models/`): Interfaces TypeScript tipadas
  - `LoginRequest`, `AuthResponse`, `GameDetailResponse`, etc.
  - Garante type-safety em toda a aplicação

- **Serviços** (`services/`): Lógica de negócio compartilhada
  - Acesso à API
  - Gerenciamento de estado (observables)
  - Validações de regra de negócio

- **Interceptores** (`interceptors/`): Middleware HTTP
  - JWT: Injeta token em todos os requests
  - Erro: Trata erros HTTP centralizadamente

- **Guards** (`guards/`): Proteção de rotas
  - `AuthGuard`: Verifica se usuário está autenticado
  - `NoAuthGuard`: Previne acesso a rotas públicas quando autenticado

### 2. **Shared Module** (`shared/`)
Componentes e serviços reutilizáveis:

- **Dashboard**: Hub central após login
- **ErrorNotification**: Notificações globais de erro
- Componentes comuns (botões, forms, etc.)

### 3. **Feature Modules** (`modules/`)
Módulos de funcionalidades específicas (lazy-loaded):

#### **Auth Module** (`modules/auth/`)
```
Responsabilidade: Autenticação e autorização
├── Components
│   ├── login.component → Aqui lógica de form
│   └── signup.component
├── Services
│   └── auth.service → Chamadas API auth
└── Routes
    ├── /auth/login
    └── /auth/signup
```

Fluxo:
1. Usuário submete formulário (Reactive Form)
2. Componente chama `AuthService.login()`
3. Service faz POST `/api/auth/login`
4. Interceptor captura resposta e armazena token
5. Redireciona para dashboard

#### **Game Module** (`modules/game/`)
```
Responsabilidade: Jogo Mastermind
├── Components
│   ├── game-play.component → Tabuleiro do jogo
│   └── game-history.component → Lista de jogos
├── Services
│   └── game.service → Chamadas API game
└── Routes
    ├── /game/play
    └── /game/history
```

**Fluxo do Jogo**:
```
1. Dashboard → "Jogar Agora"
   ↓
2. GameService.startGame() → POST /api/games/start
   ↓
3. Receive StartGameResponse com gameCode
   ↓
4. Navigate to /game/play (renderiza GamePlayComponent)
   ↓
5. Display tentativas anteriores (matrix)
   ↓
6. Input de cor (4 cores: A, B, C, D, E, F)
   ↓
7. Submit → GameService.submitGuess(gameCode, guess)
   ↓
8. POST /api/games/{gameCode}/guess
   ↓
9. Update tabuleiro com resultado (exatos + parciais)
   ↓
10. Repeat até WON ou LOST
```

#### **Ranking Module** (`modules/ranking/`)
```
Responsabilidade: Leaderboard
├── Components
│   └── ranking.component → Top players
├── Services
│   └── ranking.service → Fetch ranking
└── Routes
    └── /ranking
```

## 🔄 Fluxo de Dados com RxJS

### AuthService (exemplo)
```typescript
// Observable pattern
private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

// Componentes se subscrevem
this.authService.isAuthenticated$.subscribe(isAuth => {
  this.showLoginButton = !isAuth;
});
```

### GameService (fetch dinâmico)
```typescript
// Current game state
private currentGameSubject = new BehaviorSubject<GameDetailResponse | null>(null);
public currentGame$ = this.currentGameSubject.asObservable();

// Componente reage em tempo real
this.gameService.currentGame$.pipe(
  takeUntil(this.destroy$)
).subscribe(game => {
  this.renderGameBoard(game);
});
```

## 🔐 Fluxo de Segurança

### 1. Login
```
[Login Component]
    ↓ (Reactive Form válido)
[AuthService.login()] 
    ↓ (POST /api/auth/login)
[HTTP Request] →  [JwtInterceptor]
    ↓ (Interceptor não tem mais token)
[Backend] → [Resposta: {token, username}]
    ↓
[AuthService] → Armazena em sessionStorage
    ↓
[BehaviorSubject] → Emite isAuthenticated = true
    ↓
[AuthGuard] → Bloqueia /auth/login (usar NoAuthGuard)
    ↓
[Router] → Navigate /dashboard (permitido)
```

### 2. Request Autenticado
```
[Dashboard Component]
    ↓ (Clica: "Ver Ranking")
[RankingService.getRanking()] 
    ↓ (GET /api/ranking)
[HTTP Request] →  [JwtInterceptor]
    ↓ (Injeta: Authorization: Bearer <token>)
[Backend] → Valida JWT → [Resposta com dados]
    ↓
[Component] → Renderiza ranking
```

### 3. Token Inválido
```
[HTTP Request com token expirado] 
    ↓
[Backend] → 401 Unauthorized
    ↓
[JwtInterceptor] → Captura erro
    ↓
[ErrorHandlingService] → showError("Não autorizado")
    ↓
[Error Notification] → Exibe mensagem
    ↓
[AuthService] → logout() (opcional)
```

## 📋 Validações (Reactive Forms)

### Login Form
```typescript
this.loginForm = this.formBuilder.group({
  username: ['', [
    Validators.required, 
    Validators.minLength(3)
  ]],
  password: ['', [
    Validators.required, 
    Validators.minLength(6)
  ]]
});
```

### Game Guess Form
```typescript
this.guessForm = this.formBuilder.group({
  guess: ['', [
    Validators.required,
    Validators.pattern(/^[ABCDEF]{4}$/)  // Validação de cores
  ]]
});
```

## 🎨 Sistema de Estilo

### Variáveis CSS Globais (`styles.scss`)
```scss
:root {
  --primary-color: #6366f1;     // Índigo
  --secondary-color: #8b5cf6;   // Roxo
  --success-color: #10b981;     // Verde
  --color-r: #ef4444;           // Vermelho (jogo)
  --color-g: #10b981;           // Verde (jogo)
  --color-b: #0284c7;           // Azul (jogo)
  --color-y: #f59e0b;           // Amarelo (jogo)
}
```

### Classes Utilitárias
```html
<button class="btn btn-primary">Jogar</button>
<button class="btn btn-secondary">Cancelar</button>
<div class="error-notification-container">...</div>
```

## 🧪 Padrão de Testes

```typescript
// game-play.component.spec.ts
describe('GamePlayComponent', () => {
  let component: GamePlayComponent;
  let gameService: jasmine.SpyObj<GameService>;

  beforeEach(() => {
    gameService = jasmine.createSpyObj('GameService', ['submitGuess']);
    TestBed.configureTestingModule({
      declarations: [GamePlayComponent],
      providers: [
        { provide: GameService, useValue: gameService }
      ]
    });
    component = TestBed.createComponent(GamePlayComponent).componentInstance;
  });

  it('deve submeter tentativa válida', () => {
    component.guessForm.patchValue({ guess: 'RGYB' });
    component.onSubmitGuess();
    expect(gameService.submitGuess).toHaveBeenCalled();
  });
});
```

## 🔄 Ciclo de Vida (Jogo em Progresso)

```
T=0s  → startGame() → GET /api/games/{id} → Renderiza tabuleiro vazio
T=10s → submitGuess(R1) → POST /api/games/{id}/guess → Atualiza attempt 1
T=20s → submitGuess(R2) → POST /api/games/{id}/guess → Atualiza attempt 2
       ...
T=100s → submitGuess(R10) → WON/LOST → Desabilita input → Mostra resultado
```

## 📱 Responsividade

### Media Queries Principais
```scss
@media (max-width: 1200px) { /* Tablet grande */ }
@media (max-width: 768px) { /* Tablet pequeno */ }
@media (max-width: 480px) { /* Mobile */ }
```

Exemplo - Game Board:
```
📱 Mobile:   Tabuleiro 1 coluna, controles empilhados
📱 Tablet:   2 colunas com side panel
💻 Desktop:  Full layout com matrix grande
```

## 🚀 Performance

### Lazy Loading de Módulos
```typescript
// app-routing.module.ts
{
  path: 'game',
  loadChildren: () => import('./modules/game/game.module')
    .then(m => m.GameModule)  // Carregado sob demanda
}
```

### RxJS - takeUntil Pattern
```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.gameService.currentGame$
    .pipe(
      takeUntil(this.destroy$)  // Unsubscribe automaticamente
    )
    .subscribe(...);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

### Change Detection OnPush (Futuro)
```typescript
@Component({
  selector: 'app-game',
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

## 🐛 Debugging Comum

### "Token não está sendo adicionado ao request"
```
✓ Verificar sessionStorage: console.log(sessionStorage.getItem('auth_token'))
✓ Verificar JwtInterceptor está registrado em CoreModule
✓ Verificar AuthService.storeAuthData() foi chamado
```

### "Erro 401 no request"
```
✓ Token expirou? Fazer login novamente
✓ Token é válido? Testar com Postman
✓ Backend configurou CORS? Verificar console
```

### "Tentativas não aparecem no tabuleiro"
```
✓ GameService.currentGame$ emitiu dados?
✓ Component se subscreveu? (takeUntil + Subscribe)
✓ GameDetailResponse.attempts não é null?
```

## 📚 Referências

- [Angular Architecture](https://angular.io/guide/architecture)
- [RxJS Operators](https://rxjs.dev/api)
- [Reactive Forms](https://angular.io/guide/reactive-forms)
- [HTTP Interceptors](https://angular.io/guide/http#interceptors)
- [Angular Guards](https://angular.io/guide/router#preventing-unauthorized-access)

---

**Última atualização**: 2024
**Versão**: 1.0.0  
**Compatível com**: Angular 15+
