
import prisma from "../database/db";

// Define os níveis de dificuldade disponíveis no jogo.
export type Dificuldade = "facil" | "medio" | "dificil";

// Representa uma palavra selecionada para uma partida.
export interface PalavraSelecionada {
  id: number;
  termo: string;
  dica: string;
  categoria: string;
}

// Busca uma palavra aleatória conforme a dificuldade escolhida.
export async function buscarPalavraAleatoria(
  dificuldade: Dificuldade = "medio"
): Promise<PalavraSelecionada | null> {
  // Consulta as palavras e suas respectivas categorias.
  const palavras = await prisma.palavra.findMany({
    include: {
      categoria: true,
    },
  });

  // Filtra as palavras conforme a quantidade de letras.
  const palavrasFiltradas = palavras.filter((palavra) => {
    const quantidadeLetras = palavra.termo.length;

    if (dificuldade === "facil") {
      return quantidadeLetras <= 6;
    }

    if (dificuldade === "medio") {
      return quantidadeLetras >= 7 && quantidadeLetras <= 9;
    }

    return quantidadeLetras >= 10;
  });

  // Verifica se existem palavras para a dificuldade escolhida.
  if (palavrasFiltradas.length === 0) {
    return null;
  }

  // Escolhe uma palavra aleatoriamente.
  const indiceAleatorio = Math.floor(
    Math.random() * palavrasFiltradas.length
  );

  const palavraEscolhida = palavrasFiltradas[indiceAleatorio];

  // Retorna somente os dados necessários.
  return {
    id: palavraEscolhida.id,
    termo: palavraEscolhida.termo,
    dica: palavraEscolhida.dica,
    categoria: palavraEscolhida.categoria.nome,
  };
}
