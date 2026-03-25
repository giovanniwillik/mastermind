# Frontend Mastermind - Angular 15+

Aplicação web do jogo Mastermind desenvolvida em **Angular 15+** com arquitetura modular, Reactive Forms, autenticação JWT e tratamento centralizado de erros.

## 🎯 Características Principais

### Arquitetura
- ✅ **Modularização clara**: modules (auth, game, ranking), core, shared
- ✅ **Separação de responsabilidades**: componentes, serviços e guards
- ✅ **Padrão reativo**: implementação com RxJS observables
- ✅ **Interceptores HTTP**: injeção automática de JWT
- ✅ **Guards de rotas**: proteção de áreas autenticadas
- ✅ **Tratamento global de erros**: feedback visual ao usuário

### Funcionalidades
- ✅ **Autenticação completa**: Login, Signup, Logout
- ✅ **Dashboard intuitivo**: navegação central e acesso rápido
- ✅ **Game engine**: rendição dinâmica da matriz de 10 tentativas
- ✅ **Ranking**: visualização dos melhores jogadores
- ✅ **Histórico**: tabuleiro de jogos passados com detalhes
- ✅ **Responsividade**: totalmente adaptável a mobile/tablet/desktop

### Código
- ✅ **TypeScript tipado**: interfaces para todos os modelos
- ✅ **Reactive Forms**: validações robustas
- ✅ **Comments**: documentação inline nos principais métodos
- ✅ **Padrões limpos**: sem lógica de negócio nos templates

## 📋 Pré-requisitos

- **Node.js** >= 16.x
- **npm** >= 8.x
- **Angular CLI** >= 15.x

## 🚀 Instalação e Setup

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Criar arquivo `.env` (baseado em `.env.example`):
```env
API_URL=http://localhost:8080/api
```

Eller modificar `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### 3. Iniciar servidor de desenvolvimento
```bash
npm start
```

Acesse http://localhost:4200/

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── core/                    // Serviços e guards essenciais
│   │   ├── models/              // Interfaces TypeScript
│   │   ├── interceptors/        // JWT e tratamento de erros
│   │   ├── guards/              // Proteção de rotas
│   │   └── core.module.ts
│   │
│   ├── modules/                 // Módulos de funcionalidades
│   │   ├── auth/                // Login e Signup
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── auth.module.ts
│   │   │   └── auth-routing.module.ts
│   │   │
│   │   ├── game/                // Motor do jogo
│   │   │   ├── components/
│   │   │   │   ├── game-play.component.ts      // Tabuleiro
│   │   │   │   └── game-history.component.ts   // Histórico
│   │   │   ├── services/
│   │   │   ├── game.module.ts
│   │   │   └── game-routing.module.ts
│   │   │
│   │   └── ranking/             // Leaderboard
│   │       ├── components/
│   │       ├── services/
│   │       ├── ranking.module.ts
│   │       └── ranking-routing.module.ts
│   │
│   ├── shared/                  // Componentes reutilizáveis
│   │   ├── components/
│   │   │   ├── dashboard.component.ts          // Hub central
│   │   │   └── error-notification.component.ts // Erros globais
│   │   └── shared.module.ts
│   │
│   ├── app.component.*
│   ├── app.module.ts
│   └── app-routing.module.ts
│
├── assets/
│   └── styles/                  // Estilos globais
│
├── environments/
│   ├── environment.ts
│   └── environment.development.ts
│
├── styles.scss                  // Tema global
├── index.html
└── main.ts
```

## 🔐 Autenticação

### Fluxo de Autenticação
1. Utilizador faz login/signup
2. Backend retorna token JWT
3. Token armazenado em `sessionStorage` (seguro)
4. Interceptor injeta `Authorization: Bearer <token>` em todos os requests
5. AuthGuard protege rotas privadas
6. Logout limpa token e redirecionaciona para login

### JWT Interceptor
```typescript
// Adicionado automaticamente em todos os requests
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## 🎮 Regras do Jogo

- **Objetivo**: Descobrir uma combinação de 4 cores
- **Cores válidas**: Vermelho (A), Verde (B), Azul (C), Amarelo (D), Laranja (E), Roxo (F)
- **Máximo de tentativas**: 10
- **Feedback por tentativa**:
  - **Exatos**: cores na posição correta
  - **Parciais**: cores corretas mas em posição errada
- **Frontend non-aware**: a combinação correta nunca é conhecida pelo cliente
- **Segurança**: validação ocorre apenas no backend

## 📱 Responsividade

A aplicação é 100% responsiva:
- **Desktop** (1200px+): layout multi-coluna
- **Tablet** (768px-1199px): layout adaptado
- **Mobile** (<768px): menu mobile, coluna única

## 🧪 Testes

### Executar testes unitários
```bash
npm test
```

### Executar com cobertura
```bash
ng test --code-coverage
```

Os testes estão preparados para:
- Componentes com Reactive Forms
- Serviços com HttpClient
- Guards de autenticação
- Interceptores HTTP

## 🔒 Segurança

- ✅ **SessionStorage**: Token em sesão (limpo ao fechar aba)
- ✅ **HTTPS**: API comunicação deve ser HTTPS em produção
- ✅ **CORS**: Configurado no backend
- ✅ **XSS Protection**: Angular sanitiza por padrão
- ✅ **CSRF**: Token JWT previne ataques CSRF

## 🚢 Build para Produção

```bash
npm run build
```

Gera arquivos otimizados em `dist/mastermind-frontend/`

Configuração de produção:
```typescript
// environment.ts (prod)
export const environment = {
  production: true,
  apiUrl: 'https://api.seu-dominio.com'
};
```

## 📦 Dependências Principais

- **@angular/core**: Framework principal
- **@angular/forms**: Reactive Forms
- **@angular/router**: Roteamento URL-driven
- **@angular/common/http**: Comunicação API
- **rxjs**: Programação reativa
- **@angular/material (opcional)**: Componentes UI avançados

## 🔧 Desenvolvimento

### Adicionar novo componente
```bash
ng generate component modules/game/components/novo-component
```

### Adicionar novo serviço
```bash
ng generate service modules/game/services/novo-service
```

### Adicionar novo módulo
```bash
ng generate module modules/novo-modulo
```

## 📝 Comentários e Documentação

- Cada classe tem comentário descrevendo seu propósito
- Métodos públicos importantes têm JSDoc comments
- Variáveis complexas têm comentários inline

## 🐛 Debug

### Browser DevTools
- Abrir F12
- Network tab: validar requests/responses
- Console: verificar erros
- Sources: breakpoints no código

### Angular DevTools
Instalar extensão Chrome "Angular DevTools" para:
- Inspecionar componentes
- Ver estado de serviços
- Profiling de performance

## 🤝 Contribuição

Ao adicionar funcionalidades novas:
1. Manter estrutura modular
2. Separar lógica em serviços
3. Usar Reactive Forms
4. Adicionar comentários
5. Manter responsividade
6. Adicionar testes unitários

## 📞 Suporte

Para dúvidas ou bugs, consulte:
- Documentação: [angular.io](https://angular.io)
- RxJS: [rxjs.dev](https://rxjs.dev)
- Material Design: [material.angular.io](https://material.angular.io)

## 📄 Licença

Projeto desenvolvido para fins educacionais durante o desenvolvimento do Mastermind Game.

---

**Desenvolvido com ❤️ em Angular 15+**
