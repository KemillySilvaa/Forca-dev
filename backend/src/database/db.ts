
// Carrega as variáveis de ambiente do arquivo .env.
import "dotenv/config";

// Importa o Prisma Client gerado pelo Prisma.
import { PrismaClient } from "../generated/prisma/client";

// Cria uma instância do Prisma Client para acessar o banco SQLite.
const prisma = new PrismaClient();

// Exporta a conexão para ser utilizada em outras partes do projeto.
export default prisma;
