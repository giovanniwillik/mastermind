# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --prefer-offline --no-audit

# Copiar código fonte
COPY . .

# Build para produção
RUN npm run build

# Verificar se build foi criado
RUN ls -la dist/

# Stage 2: Nginx
FROM nginx:alpine

# Criar diretório html
RUN mkdir -p /usr/share/nginx/html

# Copiar nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build do Angular
COPY --from=build /app/dist/mastermind-frontend /usr/share/nginx/html

# Verificar arquivos copiados
RUN ls -la /usr/share/nginx/html

# Expor porta
EXPOSE 80

# Health check
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Comando padrão
CMD ["nginx", "-g", "daemon off;"]
