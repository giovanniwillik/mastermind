# Mastermind Game - Full Stack Application

## 📋 Descrição da Solução

**Mastermind** é uma implementação digital do clássico jogo de estratégia onde o jogador tenta adivinhar uma combinação de 4 cores em até 10 tentativas. A aplicação é totalmente containerizada com Docker, permitindo deployment em um único comando.

### Arquitetura da Solução

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Angular)                    │
│  Localhost:80 (Docker) / Localhost:4200 (Desenvolvimento)│
│  - Reactive Forms com validações                         │
│  - RxJS Observables para estado reativo                  │
│  - Dashboard, Game Engine, Ranking, Histórico            │
│  - Responsivo (Mobile/Tablet/Desktop)                    │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS
                     ↓
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (Spring Boot)                   │
│           Localhost:8080 / Port 8080 (Docker)            │
│  - Spring Security + JWT para autenticação               │
│  - Endpoints RESTful em /api/auth, /api/games, /api/ranking│
│  - Swagger/OpenAPI em /swagger-ui.html                   │
│  - CORS configurado para front-end                       │
└────────────────────┬────────────────────────────────────┘
                     │ JDBC
                     ↓
┌─────────────────────────────────────────────────────────┐
│              DATABASE (PostgreSQL 15)                    │
│                 Port 5432                                │
│  - 3 Tabelas: users, games, attempts                     │
│  - Schema inicializado automaticamente                   │
└─────────────────────────────────────────────────────────┘
```

### Decisões Técnicas Relevantes

1. **Spring Boot 3.2.5 + Java 17**: Versão LTS moderna com suporte a Jakarta EE e melhor performance
2. **Angular 15 + TypeScript**: Framework maduro com excelente ecosystem e suporte
3. **PostgreSQL 15**: Banco relacional robusto com UUID nativo para game codes
4. **Docker Compose**: Orquestração simplificada com health checks automáticos
5. **JWT com Spring Security**: Autenticação stateless segura e escalável
6. **Schema.sql vs Flyway**: Simplificado para deployment sem conflitos de migração
7. **Nginx Alpine**: Reverse proxy leve com SPA routing configurado
8. **ObjectProvider Lazy Loading**: Resolve dependências circulares no Spring
9. **sessionStorage para JWT**: Limpa automaticamente ao fechar a aba (não persiste)

---

## 🔧 Pré-requisitos

### Versões Requeridas

| Componente | Versão Mínima | Testado com |
|-----------|--------------|------------|
| **Java** | 17 | Java 17.0.18 |
| **Maven** | 3.8+ | 3.9.x |
| **Node.js** | 18+ | 18-Alpine |
| **npm** | 9+ | v9.x |
| **Docker** | 20.10+ | Desktop 4.x |
| **Docker Compose** | 2.0+ | v2.x |
| **PostgreSQL** | 13+ | 15 |
| **Git** | 2.0+ | 2.x |

### Windows (WSL2 Recomendado)
- Docker Desktop for Windows com WSL2 backend
- PowerShell ou Command Prompt (Windows Terminal recomendado)
- Git Bash ou GitPod (opcional)

### macOS
- Docker Desktop for Mac (Apple Silicon ou Intel)
- Xcode Command Line Tools: `xcode-select --install`
- Homebrew para gerenciar dependências

### Linux
- Docker Engine + Docker Compose
- Java 17: `sudo apt-get install openjdk-17-jdk`
- Node.js: Via NVM ou gerenciador de pacotes

---

## 🚀 Como Rodar com Docker (Recomendado)

### Passo 1: Clonar Repositório

```bash
git clone https://github.com/seu-usuario/mastermind.git
cd mastermind
```

### Passo 2: Criar Arquivo de Variáveis de Ambiente

```bash
# Copiar .env.example para criar .env para desenvolvimento
cp .env.example .env

# O arquivo .env contém valores padrão que funcionam para desenvolvimento
# Edite se necessário para seu ambiente local:
nano .env  # ou seu editor favorito

# Para produção, crie arquivo separado:
cp .env.example .env.production
# Edite .env.production com valores de produção (JWT_SECRET, DB_PASSWORD, etc.)

# Depois use ao iniciar:
# docker-compose --env-file .env.production up -d --build
```

**Importante**: `.env` está em `.gitignore` e **não deve ser commitado**. Apenas `.env.example` fica no repositório.

### Passo 3: Iniciar Aplicação

```bash
# Iniciar todos os containers
docker-compose up -d --build

# Verificar status
docker-compose ps

# Acompanhar logs do backend (Ctrl+C para parar)
docker-compose logs -f backend
```

### Passo 4: Acessar Aplicação

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost | Interface do jogo |
| **Backend** | http://localhost:8080/api | API REST |
| **Swagger** | http://localhost:8080/swagger-ui.html | Documentação interativa |
| **Database** | localhost:5432 | PostgreSQL (usuário: postgres) |

### Parar Aplicação

```bash
# Parar containers (dados persistem)
docker-compose stop

# Remover containers (com dados)
docker-compose down

# Remover tudo incluindo volumes (CUIDADO!)
docker-compose down -v
```

---

## 💻 Como Rodar Localmente (Backend)

### Pré-requisitos Locais

```bash
# Verificar Java
java -version

# Verificar Maven
mvn -version

# Instalar PostgreSQL e criar banco
# Windows: Baixe de https://www.postgresql.org/download/windows/
# macOS: brew install postgresql@15
# Linux: sudo apt-get install postgresql-15

# Criar banco de dados
psql -U postgres -c "CREATE DATABASE mastermind;"
```

### Passo 1: Configurar Backend

```bash
cd backend

# O arquivo .env está na raiz do projeto com valores padrão
# Para variáveis locais diferentes, você pode:
# 1. Editar .env na raiz
# 2. Ou editar backend/src/main/resources/application.yml
# 3. Ou usar variáveis de ambiente do sistema

# Spring Boot carrega nesta ordem (maior prioridade):
# 1. Variáveis de sistema
# 2. Arquivo .env (via spring-dotenv)
# 3. Valores padrão em application.yml
```

### Passo 2: Compilar e Rodar

```bash
# Restaurar dependências e compilar
mvn clean compile

# Executar testes (opcional)
mvn test

# Rodar Spring Boot (carrega variáveis de .env)
mvn spring-boot:run

# Backend ativa em: http://localhost:8080
```

### Passo 3: Verificar Conexão

```bash
# Testar endpoint público (ranking)
curl http://localhost:8080/api/ranking

# Resposta esperada: []
```

---

## 💻 Como Rodar Localmente (Frontend)

### Pré-requisitos Locais

```bash
# Verificar Node.js e npm
node --version
npm --version

# Se necessário, instalar NVM
# Windows: https://github.com/nvm-sh/nvm-windows
# macOS/Linux: https://github.com/nvm-sh/nvm
```

### Passo 1: Configurar Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Verificar environment.development.ts
# apiUrl deve apontar para o backend (http://localhost:8080/api)
cat src/environments/environment.development.ts
```

### Passo 2: Rodar Servidor de Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm start

# Frontend ativa em: http://localhost:4200
# Hot reload automático para alterações de código
```

### Passo 3: Build para Produção

```bash
# Compilar versão otimizada
npm run build

# Artefato gerado em: dist/mastermind-frontend/
```

---

## 🔐 Variáveis de Ambiente

### Arquivo `.env`

O projeto usa um arquivo `.env` para gerenciar todas as variáveis de ambiente.

#### Como Criar o Arquivo `.env`

**Apenas `.env.example` fica no repositório** (arquivo template). Cada desenvolvedor/ambiente deve criar seu próprio `.env`:

```bash
# Copiar arquivo exemplo para criar .env
cp .env.example .env

# Editar .env conforme necessário para seu ambiente
# nano .env  # ou seu editor favorito
```

Arquivo `.env` resultante (exemplo com valores padrão para desenvolvimento):

```bash
# DATABASE
DB_URL=jdbc:postgresql://db:5432/mastermind
DB_USERNAME=postgres
DB_PASSWORD=postgres

# SERVER
SERVER_PORT=8080

# JWT / SECURITY
JWT_SECRET=your-super-secure-secret-key-minimum-32-characters
JWT_EXPIRATION=86400000

# FRONTEND (Docker)
BACKEND_URL=http://backend:8080

# CORS
CORS_ALLOWED_ORIGINS=http://localhost,http://localhost:4200

# LOGGING
LOGGING_LEVEL=INFO

# ENVIRONMENT
ENVIRONMENT=development
```

#### Arquivo `.env.example` (Template no Repositório)

Consulte [`.env.example`](.env.example) para documentação completa de todas as variáveis disponíveis com explicações detalhadas.

**Segurança**: Arquivo `.env` está em `.gitignore` e **nunca deve ser commitado**.

### Como Usar em Docker

#### Desenvolvimento (Padrão)

```bash
# Usar .env padrão
docker-compose up -d --build

# Ou especificar arquivo .env customizado
docker-compose --env-file .env.local up -d --build
```

#### Produção

1. **Copiar exemplo para nova configuração**:
```bash
cp .env.example .env.production
```

2. **Editar com valores de produção** (`nano .env.production` ou seu editor):
```bash
# Database de produção
DB_URL=jdbc:postgresql://db.production.com:5432/mastermind_prod
DB_USERNAME=mastermind_user
DB_PASSWORD=SENHA_FORTE_123456789_ABCDEFGHIJK

# JWT com chave segura (veja abaixo)
JWT_SECRET=JUXxYz5K9pL8mN2vQr4tW6yU3hJkI7bF

# CORS para seu domínio
CORS_ALLOWED_ORIGINS=https://mastermind.com,https://api.mastermind.com

# Logging em produção
LOGGING_LEVEL=WARN

# Ambiente
ENVIRONMENT=production
```

3. **Iniciar com arquivo customizado**:
```bash
docker-compose --env-file .env.production up -d --build
```

### Como Gerar JWT_SECRET Seguro

**IMPORTANTE**: NUNCA use valores frágeis ou padrão em produção.

```bash
# Linux/macOS
openssl rand -base64 32

# Windows PowerShell
$bytes = [System.Byte[]]::new(32)
$rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::new()
$rng.GetBytes($bytes)
[System.Convert]::ToBase64String($bytes)

# Ou use um gerador online (menos seguro)
# https://www.random.org/strings/
```

### Variáveis Suportadas

| Variável | Descrição | Padrão | Comentário |
|----------|-----------|--------|-----------|
| `DB_URL` | URL de conexão PostgreSQL | `jdbc:postgresql://db:5432/mastermind` | Alterar para produção |
| `DB_USERNAME` | Usuário PostgreSQL | `postgres` | Usar usuário menos privilegiado em produção |
| `DB_PASSWORD` | Senha PostgreSQL | `postgres` | **MUDE em produção!** |
| `SERVER_PORT` | Porta Spring Boot | `8080` | Geralmente mantém 8080 (proxy reverso na frente) |
| `JWT_SECRET` | Chave JWT secreta | Valor padrão (inseguro) | **MUDE em produção!** Mínimo 32 caracteres |
| `JWT_EXPIRATION` | Expiração token (ms) | `86400000` (24h) | Personalizar conforme política |
| `BACKEND_URL` | URL do backend (Docker) | `http://backend:8080` | Para comunicação intra-container |
| `CORS_ALLOWED_ORIGINS` | Origins CORS permitidas | `http://localhost,http://localhost:4200` | Separe múltiplas com vírgula |
| `LOGGING_LEVEL` | Nível de log | `INFO` | DEBUG/INFO/WARN/ERROR |
| `ENVIRONMENT` | Identificador ambiente | `development` | development/staging/production |

---

## 📡 Documentação da API

### Acessar Swagger/OpenAPI

1. **Localmente**: http://localhost:8080/swagger-ui.html
2. **Via Docker**: http://localhost:8080/swagger-ui.html

A documentação interativa permite:
- Visualizar todos os endpoints disponíveis
- Ver modelos de requisição/resposta
- Testar endpoints diretamente (com autenticação)
- Gerar cliente SDK (OpenAPI)

### Endpoints Principais

```
POST   /api/auth/signup          - Registrar novo usuário
POST   /api/auth/login           - Fazer login
GET    /api/games                - Listar jogos do usuário (autenticado)
POST   /api/games/start          - Iniciar novo jogo (autenticado)
GET    /api/games/{gameCode}     - Detalhes de um jogo (autenticado)
POST   /api/games/{gameCode}/guess - Submeter tentativa (autenticado)
GET    /api/ranking              - Ranking público (todos podem ver)
```

### Autenticação com JWT

```bash
# 1. Fazer signup ou login
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "player1",
    "email": "player@example.com",
    "password": "SecurePass123"
  }'

# Resposta contém o token JWT
# { "token": "eyJhbGciOiJIUzI1NiJ9...", "username": "player1" }

# 2. Usar token em requisições autenticadas
curl -X GET http://localhost:8080/api/games \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```

---

## 📸 Demonstração (gifs)

### [Login/Signup]

![Demo Sign In e Log In](docs/gifs/signin_login.gif)

### [Sobre o Jogo]

![Acessando Infos em "Sobre o Jogo"](docs/gifs/sobre_o_jogo.gif)

### [Gameplay]

![Demo do Jogo](docs/gifs/gameplay.gif)

### [Histórico]

![Demo Histórico de Jogos](docs/gifs/historico.gif)

### [Ranking]

![Demo Ranking de Jogadores](docs/gifs/ranking.gif)

---

## 🐛 Troubleshooting

### Backend não conecta ao banco

```bash
# Verificar se PostgreSQL está rodando
docker-compose ps db

# Ver logs do banco
docker-compose logs db

# Reiniciar banco isoladamente
docker-compose restart db
docker-compose logs -f db
```

### Frontend diz "Bad Gateway"

```bash
# Backend pode estar ainda inicializando (esperar 30 segundos)
# Verificar logs do backend
docker-compose logs -f backend

# Verificar se URL está correta em environment.ts
cat frontend/src/environments/environment.ts
```

### Erro 401 Unauthorized

```bash
# Token expirou (tempo: 24 horas por padrão)
# Fazer login novamente para obter novo token

# Verificar token em: https://jwt.io
# (Cole o token no debugger para ver claims)
```

### Porta já em uso

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8080
kill -9 <PID>

# Ou mudar porta em docker-compose.yml ou application.yml
```

---

## 🔄 Workflow de Desenvolvimento

### Backend

```bash
# Após modificações no código Java
mvn clean compile
mvn spring-boot:run

# Ou rebuild Docker image
docker-compose build backend
docker-compose up -d backend
```

### Frontend

```bash
# Hot reload automático em npm start
# Para rebuild com nova configuração
npm run build

# Rebuild Docker image
docker-compose build frontend
docker-compose up -d frontend
```

### Database

```bash
# Resetar banco de dados (Cuidado!)
docker-compose down -v
docker-compose up -d db
# Schema.sql será executado automaticamente
```

---

## 📊 Stack Técnico Resumido

### Backend
- **Framework**: Spring Boot 3.2.5 (Java 17)
- **Banco**: PostgreSQL 15
- **Segurança**: Spring Security + JWT
- **Docs**: Springdoc OpenAPI (Swagger)
- **Build**: Maven 3.9+
- **ORM**: Hibernate 6.4 + JPA

### Frontend
- **Framework**: Angular 15
- **Linguagem**: TypeScript 5
- **Styles**: SCSS com variáveis CSS
- **HTTP Client**: Angular HttpClient
- **Forms**: Reactive Forms com validações
- **Build**: @angular-cli 15
- **Servidor**: Nginx Alpine

### DevOps
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx Alpine
- **DB Init**: SQL Schema automático
- **Health Checks**: Built-in para DB

---

## 📄 Estrutura do Projeto

```
mastermind/
├── backend/                          # Spring Boot (Java 17)
│   ├── src/
│   │   ├── main/java/com/giovanni/mastermind/
│   │   │   ├── controller/          # RestControllers
│   │   │   ├── service/             # Lógica de negócio
│   │   │   ├── model/               # Entidades JPA
│   │   │   ├── repository/          # Data Access Layer
│   │   │   ├── config/              # Segurança, CORS, JWT
│   │   │   └── exception/           # Exception handlers
│   │   ├── resources/
│   │   │   ├── application.yml      # Configuração Spring
│   │   │   └── schema.sql           # Inicialização BD
│   │   └── test/                    # Testes unitários
│   ├── Dockerfile                   # Multi-stage build
│   └── pom.xml                      # Dependências Maven
│
├── frontend/                         # Angular 15
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/                # Guards, Interceptors, Models
│   │   │   ├── modules/             # Feature modules (auth, game, ranking)
│   │   │   ├── shared/              # Componentes compartilhados
│   │   │   └── app.module.ts        # Root module
│   │   ├── environments/            # Configuração por ambiente
│   │   └── styles.scss              # Estilos globais
│   ├── Dockerfile                   # Node build + Nginx
│   ├── nginx.conf                   # Reverse proxy config
│   └── package.json                 # Dependências npm
│
├── docker-compose.yml               # Orquestração (DB + Backend + Frontend)
├── .env.example                     # Template de variáveis
├── README.md                        # Este arquivo
└── docs/                            # Documentação adicional
    ├── screenshots/                 # [COLOQUE AQUI]
    └── gifs/                        # [COLOQUE AQUI]
```

---

## 🚢 Deploy em Produção

### Pre-flight Checklist

- [ ] Mudar `JWT_SECRET` para valor aleatório seguro (32+ chars)
- [ ] Mudar `DB_PASSWORD` para senha forte
- [ ] Mudar `DB_URL` para servidor de produção
- [ ] Ativar HTTPS no Nginx (certificado SSL)
- [ ] Configurar CORS para domínios específicos
- [ ] Aumentar `JWT_EXPIRATION` se necessário
- [ ] Configurar backup automático do banco
- [ ] Revisar limites de recursos (CPU, memória)
- [ ] Configurar container registry (Docker Hub, ECR)
- [ ] Habilitar logging centralizado

---

**Última atualização**: 25 de Março de 2026 | **Versão**: 1.0.0
