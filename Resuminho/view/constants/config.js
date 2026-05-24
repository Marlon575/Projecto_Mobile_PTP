const config = {
  // URL base da API — muda para o IP da tua máquina quando testares
  // Com emulador Android usa 10.0.2.2
  // Com telemóvel real usa o IP local (ex: 192.168.1.x)
API_URL: 'https://resuminho-api.onrender.com',

  // Tempo limite de resposta em milissegundos
  TIMEOUT: 10000,

  // Paginação
  ITENS_POR_PAGINA: 10,

  // Tamanho máximo de ficheiro PDF em bytes (10MB)
  TAMANHO_MAXIMO_PDF: 10 * 1024 * 1024,

  // Tipos de ficheiro aceites
  TIPOS_FICHEIRO: ['application/pdf'],

  // Chave para guardar o token no AsyncStorage
  CHAVE_TOKEN: '@resuminho_token',
  CHAVE_UTILIZADOR: '@resuminho_utilizador',
};

export default config;