/**
 * Configurações de ambiente para produção
 * Em Docker, usa /api que o nginx faz proxy para o backend
 * Em produção local, ajuste para sua URL de API
 */
export const environment = {
  production: true,
  apiUrl: '/api'
};
