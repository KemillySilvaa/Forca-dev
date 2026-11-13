
import Fastify from "fastify";

// Cria uma instância do servidor Fastify.
// O logger registra informações e erros no terminal.
const server = Fastify({
  logger: true,
});

// Cria uma rota inicial para verificar se a API está funcionando.
server.get("/health", async () => {
  return {
    status: "ok",
    message: "API Forca Dev funcionando!",
  };
});

// Define a porta e inicia o servidor.
const start = async () => {
  try {
    await server.listen({
      port: 3333,
      host: "127.0.0.1",
    });
  } catch (error) {
    // Registra o erro caso o servidor não consiga iniciar.
    server.log.error(error);

    // Encerra a aplicação se ocorrer uma falha.
    process.exit(1);
  }
};

// Executa a inicialização do servidor.
start();
